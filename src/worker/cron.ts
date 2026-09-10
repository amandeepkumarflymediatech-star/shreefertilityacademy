import cron from 'node-cron';
import { LiveClass, ClassEnrollment, User } from '../models';
import { Op } from 'sequelize';
import { sendClassReminderEmail } from '../lib/email';

// Cron Job running every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Cron Job Running: Checking for upcoming LiveClasses...');

  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 1. Check for 24h reminders
    const upcoming24h = await LiveClass.findAll({
      where: {
        status: 'SCHEDULED',
        reminderSent24h: false,
        scheduledAt: {
          [Op.lte]: twentyFourHoursFromNow,
          [Op.gt]: twoHoursFromNow,
        },
      },
      include: [{
        model: ClassEnrollment,
        as: 'enrollments',
        include: [{
          model: User,
          as: 'student'
        }]
      }],
    });

    for (const liveClass of upcoming24h as any[]) {
      if (liveClass.enrollments) {
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
      }
      
      await liveClass.update({ reminderSent24h: true });
      console.log(`Sent 24h reminders for class: ${liveClass.title}`);
    }

    // 2. Check for 2h reminders
    const upcoming2h = await LiveClass.findAll({
      where: {
        status: 'SCHEDULED',
        reminderSent2h: false,
        scheduledAt: {
          [Op.lte]: twoHoursFromNow,
          [Op.gt]: now,
        },
      },
      include: [{
        model: ClassEnrollment,
        as: 'enrollments',
        include: [{
          model: User,
          as: 'student'
        }]
      }],
    });

    for (const liveClass of upcoming2h as any[]) {
      if (liveClass.enrollments) {
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
      }
      
      await liveClass.update({ reminderSent2h: true, reminderSent24h: true }); // Set both to true just in case
      console.log(`Sent 2h reminders for class: ${liveClass.title}`);
    }

  } catch (error) {
    console.error('Error in Cron Job:', error);
  }
});

console.log('Class Reminder Cron Worker started successfully.');

