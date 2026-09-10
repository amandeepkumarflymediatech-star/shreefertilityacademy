// Central Models Index & Associations

// 1. Core Authentication & User Management
export * from './User';
export * from './Account';
export * from './NextAuthSession';
export * from './PasswordResetToken';

// 2. Memberships, Live Classes & Enrollments
export * from './Membership';
export * from './LiveClass';
export * from './ClassEnrollment';
export * from './PricingPackage';

// 3. Orders, Payments, Coupons & Billing
export * from './Order';
export * from './Payment';
export * from './PaymentTransaction';
export * from './Coupon';
export * from './WebhookEvent';

// 4. Learning & Course Management
export * from './Course';
export * from './Chapter';
export * from './Lesson';
export * from './LessonProgress';

// 5. Communications, Feedback & Content
export * from './ContactMessage';
export * from './BlogPost';
export * from './Review';
export * from './Notification';
export * from './ActivityLog';
export * from './PlatformSetting';
export * from './SeoMetadata';

// Import model classes for establishing associations
import { User } from './User';
import { Membership } from './Membership';
import { LiveClass } from './LiveClass';
import { ClassEnrollment } from './ClassEnrollment';
import { Order } from './Order';
import { Payment } from './Payment';
import { Coupon } from './Coupon';
import { PricingPackage } from './PricingPackage';
import { BlogPost } from './BlogPost';
import { Review } from './Review';
import { Course } from './Course';
import { Chapter } from './Chapter';
import { Lesson } from './Lesson';
import { LessonProgress } from './LessonProgress';

// ==========================================
// Model Associations
// ==========================================

// Class Enrollment <-> User & LiveClass
ClassEnrollment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(ClassEnrollment, { as: 'enrollments', foreignKey: 'studentId' });

ClassEnrollment.belongsTo(LiveClass, { as: 'session', foreignKey: 'sessionId' });
LiveClass.hasMany(ClassEnrollment, { as: 'enrollments', foreignKey: 'sessionId' });

// LiveClass <-> Tutor (User)
LiveClass.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });
User.hasMany(LiveClass, { as: 'taughtClasses', foreignKey: 'tutorId' });

// Order <-> User, Package, Membership, Coupon, Payment
Order.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Order, { as: 'orders', foreignKey: 'studentId' });

Order.belongsTo(PricingPackage, { as: 'package', foreignKey: 'membershipId', constraints: false });
PricingPackage.hasMany(Order, { as: 'orders', foreignKey: 'membershipId', constraints: false });

Order.belongsTo(Membership, { as: 'membership', foreignKey: 'membershipId', constraints: false });
Membership.hasMany(Order, { as: 'orders', foreignKey: 'membershipId', constraints: false });

Order.hasOne(Payment, { as: 'payment', foreignKey: 'orderId' });
Payment.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

Order.belongsTo(Coupon, { as: 'coupon', foreignKey: 'couponId' });
Coupon.hasMany(Order, { as: 'orders', foreignKey: 'couponId' });

// Membership <-> User
Membership.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Membership, { as: 'memberships', foreignKey: 'studentId' });

// Payment <-> User
Payment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Payment, { as: 'payments', foreignKey: 'studentId' });

// BlogPost <-> Author (User)
BlogPost.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(BlogPost, { as: 'blogPosts', foreignKey: 'authorId' });

// Review <-> Tutor & Student (User)
Review.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });
Review.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Review, { as: 'receivedReviews', foreignKey: 'tutorId' });
User.hasMany(Review, { as: 'givenReviews', foreignKey: 'studentId' });

// Course <-> Chapter <-> Lesson
Chapter.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });
Course.hasMany(Chapter, { as: 'chapters', foreignKey: 'courseId' });

Lesson.belongsTo(Chapter, { as: 'chapter', foreignKey: 'chapterId' });
Chapter.hasMany(Lesson, { as: 'lessons', foreignKey: 'chapterId' });

// LessonProgress <-> User & Lesson
LessonProgress.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
LessonProgress.belongsTo(Lesson, { as: 'lesson', foreignKey: 'lessonId' });
User.hasMany(LessonProgress, { as: 'lessonProgress', foreignKey: 'studentId' });
Lesson.hasMany(LessonProgress, { as: 'progressRecords', foreignKey: 'lessonId' });
