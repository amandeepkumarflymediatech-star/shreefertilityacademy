import cron from 'node-cron';
import { prisma } from '../lib/db';
import { sendClassReminderEmail } from '../lib/email';

// Cron Job running every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Cron Job Running: Checking for upcoming LiveClasses...');

  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 1. Check for 24h reminders
    const upcoming24h = await prisma.liveClass.findMany({
      where: {
        status: 'SCHEDULED',
        reminderSent24h: false,
        scheduledAt: {
          lte: twentyFourHoursFromNow,
          gt: twoHoursFromNow,
        },
      },
      include: {
        enrollments: { include: { student: true } },
      },
    });

    for (const liveClass of upcoming24h) {
      for (const enrollment of liveClass.enrollments) {
        if (enrollment.student && enrollment.student.email) {
          await sendClassReminderEmail(
            enrollment.student.email,
            liveClass.title,
            liveClass.meetingUrl,
            liveClass.scheduledAt,
            "24h"
          );
        }
      }
      
      await prisma.liveClass.update({
        where: { id: liveClass.id },
        data: { reminderSent24h: true },
      });
      console.log(`Sent 24h reminders for class: ${liveClass.title}`);
    }

    // 2. Check for 2h reminders
    const upcoming2h = await prisma.liveClass.findMany({
      where: {
        status: 'SCHEDULED',
        reminderSent2h: false,
        scheduledAt: {
          lte: twoHoursFromNow,
          gt: now,
        },
      },
      include: {
        enrollments: { include: { student: true } },
      },
    });

    for (const liveClass of upcoming2h) {
      for (const enrollment of liveClass.enrollments) {
        if (enrollment.student && enrollment.student.email) {
          await sendClassReminderEmail(
            enrollment.student.email,
            liveClass.title,
            liveClass.meetingUrl,
            liveClass.scheduledAt,
            "2h"
          );
        }
      }
      
      await prisma.liveClass.update({
        where: { id: liveClass.id },
        data: { reminderSent2h: true, reminderSent24h: true }, // Set both to true just in case
      });
      console.log(`Sent 2h reminders for class: ${liveClass.title}`);
    }

  } catch (error) {
    console.error('Error in Cron Job:', error);
  }
});

console.log('Class Reminder Cron Worker started successfully.');
