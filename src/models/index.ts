import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export const RoleEnum = {
  ADMIN: 'ADMIN',
  TUTOR: 'TUTOR',
  STUDENT: 'STUDENT',
};

export const OnboardingStatusEnum = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
};

export interface UserAttributes {
  id?: string;
  email: string;
  name?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role?: any;
  isActive?: boolean;
  onboardingStatus?: any;
  phone?: string;
  timezone?: string;
  bio?: string;
  experience?: string;
  qualifications?: string;
  languages?: string;
  teachingHeadline?: string;
  teachingLevels?: string;
  teachingAges?: string;
  teachingStyle?: string;
  isApproved?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: any;
  declare email: any;
  declare name: any;
  declare emailVerified: any;
  declare image: any;
  declare password: any;
  declare role: any;
  declare isActive: any;
  declare onboardingStatus: any;
  declare phone: any;
  declare timezone: any;
  declare bio: any;
  declare experience: any;
  declare qualifications: any;
  declare languages: any;
  declare teachingHeadline: any;
  declare teachingLevels: any;
  declare teachingAges: any;
  declare teachingStyle: any;
  declare isApproved: any;
  declare addressLine1: any;
  declare addressLine2: any;
  declare city: any;
  declare state: any;
  declare country: any;
  declare zipCode: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface AccountAttributes {
  id?: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  declare id: any;
  declare userId: any;
  declare type: any;
  declare provider: any;
  declare providerAccountId: any;
  declare refresh_token: any;
  declare access_token: any;
  declare expires_at: any;
  declare token_type: any;
  declare scope: any;
  declare id_token: any;
  declare session_state: any;
}

export interface NextAuthSessionAttributes {
  id?: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface NextAuthSessionCreationAttributes extends Optional<NextAuthSessionAttributes, 'id'> {}

export class NextAuthSession extends Model<NextAuthSessionAttributes, NextAuthSessionCreationAttributes> implements NextAuthSessionAttributes {
  declare id: any;
  declare sessionToken: any;
  declare userId: any;
  declare expires: any;
}

export interface MembershipAttributes {
  id?: string;
  studentId: string;
  startDate?: Date;
  validUntil: Date;
  status?: string;
  maxClasses?: number;
  usedClasses?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id'> {}

export class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  declare id: any;
  declare studentId: any;
  declare startDate: any;
  declare validUntil: any;
  declare status: any;
  declare maxClasses: any;
  declare usedClasses: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface LiveClassAttributes {
  id?: string;
  tutorId: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  meetingUrl?: string;
  recordingUrl?: string;
  status?: string;
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LiveClassCreationAttributes extends Optional<LiveClassAttributes, 'id'> {}

export class LiveClass extends Model<LiveClassAttributes, LiveClassCreationAttributes> implements LiveClassAttributes {
  declare id: any;
  declare tutorId: any;
  declare title: any;
  declare description: any;
  declare scheduledAt: any;
  declare meetingUrl: any;
  declare recordingUrl: any;
  declare status: any;
  declare reminderSent24h: any;
  declare reminderSent2h: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface ClassEnrollmentAttributes {
  id?: string;
  sessionId: string;
  studentId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassEnrollmentCreationAttributes extends Optional<ClassEnrollmentAttributes, 'id'> {}

export class ClassEnrollment extends Model<ClassEnrollmentAttributes, ClassEnrollmentCreationAttributes> implements ClassEnrollmentAttributes {
  declare id: any;
  declare sessionId: any;
  declare studentId: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface OrderAttributes {
  id?: string;
  studentId: string;
  membershipId?: string;
  couponId?: string;
  amount: number;
  currency?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: any;
  declare studentId: any;
  declare membershipId: any;
  declare couponId: any;
  declare amount: any;
  declare currency: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface PaymentAttributes {
  id?: string;
  orderId: string;
  studentId: string;
  amount: number;
  currency?: string;
  merchantTransactionId: string;
  phonepeTransactionId?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: any;
  declare orderId: any;
  declare studentId: any;
  declare amount: any;
  declare currency: any;
  declare merchantTransactionId: any;
  declare phonepeTransactionId: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface PaymentTransactionAttributes {
  id?: string;
  paymentId: string;
  status: string;
  rawData: string;
  createdAt?: Date;
}

export interface PaymentTransactionCreationAttributes extends Optional<PaymentTransactionAttributes, 'id'> {}

export class PaymentTransaction extends Model<PaymentTransactionAttributes, PaymentTransactionCreationAttributes> implements PaymentTransactionAttributes {
  declare id: any;
  declare paymentId: any;
  declare status: any;
  declare rawData: any;
  declare createdAt: any;
}

export interface WebhookEventAttributes {
  id?: string;
  source?: string;
  eventId: string;
  eventType: string;
  payload: string;
  status?: string;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WebhookEventCreationAttributes extends Optional<WebhookEventAttributes, 'id'> {}

export class WebhookEvent extends Model<WebhookEventAttributes, WebhookEventCreationAttributes> implements WebhookEventAttributes {
  declare id: any;
  declare source: any;
  declare eventId: any;
  declare eventType: any;
  declare payload: any;
  declare status: any;
  declare error: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface NotificationAttributes {
  id?: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  relatedId?: string;
  createdAt?: Date;
}

export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: any;
  declare userId: any;
  declare type: any;
  declare title: any;
  declare message: any;
  declare isRead: any;
  declare relatedId: any;
  declare createdAt: any;
}

export interface ActivityLogAttributes {
  id?: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: Date;
}

export interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id'> {}

export class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
  declare id: any;
  declare actorId: any;
  declare action: any;
  declare entityType: any;
  declare entityId: any;
  declare oldValue: any;
  declare newValue: any;
  declare createdAt: any;
}

export interface PlatformSettingAttributes {
  id?: string;
  key: string;
  value: string;
  description?: string;
  updatedAt?: Date;
}

export interface PlatformSettingCreationAttributes extends Optional<PlatformSettingAttributes, 'id'> {}

export class PlatformSetting extends Model<PlatformSettingAttributes, PlatformSettingCreationAttributes> implements PlatformSettingAttributes {
  declare id: any;
  declare key: any;
  declare value: any;
  declare description: any;
  declare updatedAt: any;
}

export interface ContactMessageAttributes {
  id?: string;
  name: string;
  email: string;
  studyPreference: string;
  message: string;
  createdAt?: Date;
  status?: string;
}

export interface ContactMessageCreationAttributes extends Optional<ContactMessageAttributes, 'id'> {}

export class ContactMessage extends Model<ContactMessageAttributes, ContactMessageCreationAttributes> implements ContactMessageAttributes {
  declare id: any;
  declare name: any;
  declare email: any;
  declare studyPreference: any;
  declare message: any;
  declare createdAt: any;
  declare status: any;
}

export interface BlogPostAttributes {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  authorId: string;
  tags?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPostCreationAttributes extends Optional<BlogPostAttributes, 'id'> {}

export class BlogPost extends Model<BlogPostAttributes, BlogPostCreationAttributes> implements BlogPostAttributes {
  declare id: any;
  declare title: any;
  declare slug: any;
  declare content: any;
  declare excerpt: any;
  declare coverImage: any;
  declare published: any;
  declare authorId: any;
  declare tags: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface SeoMetadataAttributes {
  id?: string;
  pagePath: string;
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  headerScripts?: string;
  footerScripts?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeoMetadataCreationAttributes extends Optional<SeoMetadataAttributes, 'id'> {}

export class SeoMetadata extends Model<SeoMetadataAttributes, SeoMetadataCreationAttributes> implements SeoMetadataAttributes {
  declare id: any;
  declare pagePath: any;
  declare title: any;
  declare description: any;
  declare keywords: any;
  declare ogImage: any;
  declare canonicalUrl: any;
  declare ogTitle: any;
  declare ogDescription: any;
  declare headerScripts: any;
  declare footerScripts: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface PasswordResetTokenAttributes {
  id?: string;
  email: string;
  token: string;
  expires: Date;
  createdAt?: Date;
}

export interface PasswordResetTokenCreationAttributes extends Optional<PasswordResetTokenAttributes, 'id'> {}

export class PasswordResetToken extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes> implements PasswordResetTokenAttributes {
  declare id: any;
  declare email: any;
  declare token: any;
  declare expires: any;
  declare createdAt: any;
}

export interface ReviewAttributes {
  id?: string;
  studentId: string;
  tutorId?: string;
  rating?: number;
  content: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  declare id: any;
  declare studentId: any;
  declare tutorId: any;
  declare rating: any;
  declare content: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface CouponAttributes {
  id?: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  usedCount?: number;
  validUntil?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CouponCreationAttributes extends Optional<CouponAttributes, 'id'> {}

export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  declare id: any;
  declare code: any;
  declare description: any;
  declare discountType: any;
  declare discountValue: any;
  declare maxUses: any;
  declare usedCount: any;
  declare validUntil: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface CourseAttributes {
  id?: string;
  title: string;
  description?: string;
  coverImage?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: any;
  declare title: any;
  declare description: any;
  declare coverImage: any;
  declare isPublished: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface ChapterAttributes {
  id?: string;
  courseId: string;
  title: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChapterCreationAttributes extends Optional<ChapterAttributes, 'id'> {}

export class Chapter extends Model<ChapterAttributes, ChapterCreationAttributes> implements ChapterAttributes {
  declare id: any;
  declare courseId: any;
  declare title: any;
  declare order: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface LessonAttributes {
  id?: string;
  chapterId: string;
  title: string;
  videoUrl?: string;
  content?: string;
  order: number;
  isPublished?: boolean;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonCreationAttributes extends Optional<LessonAttributes, 'id'> {}

export class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare id: any;
  declare chapterId: any;
  declare title: any;
  declare videoUrl: any;
  declare content: any;
  declare order: any;
  declare isPublished: any;
  declare duration: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface LessonProgressAttributes {
  id?: string;
  studentId: string;
  lessonId: string;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonProgressCreationAttributes extends Optional<LessonProgressAttributes, 'id'> {}

export class LessonProgress extends Model<LessonProgressAttributes, LessonProgressCreationAttributes> implements LessonProgressAttributes {
  declare id: any;
  declare studentId: any;
  declare lessonId: any;
  declare isCompleted: any;
  declare createdAt: any;
  declare updatedAt: any;
}

export interface PricingPackageAttributes {
  id?: string;
  title: string;
  price: number;
  regularPrice?: number;
  classCount?: number;
  tagline?: string;
  validTill?: Date | null;
  features?: string; // Stored as JSON string
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PricingPackageCreationAttributes extends Optional<PricingPackageAttributes, 'id'> {}

export class PricingPackage extends Model<PricingPackageAttributes, PricingPackageCreationAttributes> implements PricingPackageAttributes {
  declare id: any;
  declare title: any;
  declare price: any;
  declare regularPrice: any;
  declare classCount: any;
  declare tagline: any;
  declare validTill: any;
  declare features: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

User.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  emailVerified: {
    type: DataTypes.DATE,
  },
  image: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  onboardingStatus: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  timezone: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  experience: {
    type: DataTypes.TEXT,
  },
  qualifications: {
    type: DataTypes.TEXT,
  },
  languages: {
    type: DataTypes.STRING,
  },
  teachingHeadline: {
    type: DataTypes.STRING,
  },
  teachingLevels: {
    type: DataTypes.STRING,
  },
  teachingAges: {
    type: DataTypes.STRING,
  },
  teachingStyle: {
    type: DataTypes.STRING,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
});

Account.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  providerAccountId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  access_token: {
    type: DataTypes.TEXT,
  },
  expires_at: {
    type: DataTypes.INTEGER,
  },
  token_type: {
    type: DataTypes.STRING,
  },
  scope: {
    type: DataTypes.STRING,
  },
  id_token: {
    type: DataTypes.TEXT,
  },
  session_state: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Account',
  timestamps: false,
});

NextAuthSession.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sessionToken: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'NextAuthSession',
  timestamps: false,
});

Membership.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  maxClasses: {
    type: DataTypes.INTEGER,
  },
  usedClasses: {
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Membership',
});

LiveClass.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  tutorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  meetingUrl: {
    type: DataTypes.STRING,
  },
  recordingUrl: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
  },
  reminderSent24h: {
    type: DataTypes.BOOLEAN,
  },
  reminderSent2h: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'LiveClass',
});

ClassEnrollment.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ClassEnrollment',
});

Order.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipId: {
    type: DataTypes.STRING,
  },
  couponId: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
});

Payment.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
  },
  merchantTransactionId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phonepeTransactionId: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Payment',
});

PaymentTransaction.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rawData: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'PaymentTransaction',
});

WebhookEvent.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  source: {
    type: DataTypes.STRING,
  },
  eventId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payload: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  error: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'WebhookEvent',
});

Notification.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
  },
  relatedId: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Notification',
});

ActivityLog.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  actorId: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldValue: {
    type: DataTypes.TEXT,
  },
  newValue: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'ActivityLog',
});

PlatformSetting.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PlatformSetting',
});

ContactMessage.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studyPreference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'ContactMessage',
});

BlogPost.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  excerpt: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  published: {
    type: DataTypes.BOOLEAN,
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'BlogPost',
});

SeoMetadata.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  pagePath: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  keywords: {
    type: DataTypes.STRING,
  },
  ogImage: {
    type: DataTypes.STRING,
  },
  canonicalUrl: {
    type: DataTypes.STRING,
  },
  ogTitle: {
    type: DataTypes.STRING,
  },
  ogDescription: {
    type: DataTypes.TEXT,
  },
  headerScripts: {
    type: DataTypes.TEXT,
  },
  footerScripts: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'SeoMetadata',
});

PasswordResetToken.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'PasswordResetToken',
});

Review.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tutorId: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Review',
});

Coupon.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maxUses: {
    type: DataTypes.INTEGER,
  },
  usedCount: {
    type: DataTypes.INTEGER,
  },
  validUntil: {
    type: DataTypes.DATE,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Coupon',
});

Course.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Course',
});

Chapter.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  courseId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Chapter',
});

Lesson.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  chapterId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Lesson',
});

LessonProgress.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lessonId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'LessonProgress',
});

PricingPackage.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  regularPrice: {
    type: DataTypes.FLOAT,
  },
  classCount: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
  },
  tagline: {
    type: DataTypes.STRING,
  },
  validTill: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PricingPackage',
});


// Associations
ClassEnrollment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(ClassEnrollment, { as: 'enrollments', foreignKey: 'studentId' });

ClassEnrollment.belongsTo(LiveClass, { as: 'session', foreignKey: 'sessionId' });
LiveClass.hasMany(ClassEnrollment, { as: 'enrollments', foreignKey: 'sessionId' });

LiveClass.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });
User.hasMany(LiveClass, { as: 'taughtClasses', foreignKey: 'tutorId' });

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

Membership.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Membership, { as: 'memberships', foreignKey: 'studentId' });

Payment.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Payment, { as: 'payments', foreignKey: 'studentId' });


BlogPost.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(BlogPost, { as: 'blogPosts', foreignKey: 'authorId' });

Review.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });
Review.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
User.hasMany(Review, { as: 'receivedReviews', foreignKey: 'tutorId' });
User.hasMany(Review, { as: 'givenReviews', foreignKey: 'studentId' });

Chapter.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });
Course.hasMany(Chapter, { as: 'chapters', foreignKey: 'courseId' });

Lesson.belongsTo(Chapter, { as: 'chapter', foreignKey: 'chapterId' });
Chapter.hasMany(Lesson, { as: 'lessons', foreignKey: 'chapterId' });

LessonProgress.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
LessonProgress.belongsTo(Lesson, { as: 'lesson', foreignKey: 'lessonId' });
User.hasMany(LessonProgress, { as: 'lessonProgress', foreignKey: 'studentId' });
Lesson.hasMany(LessonProgress, { as: 'progressRecords', foreignKey: 'lessonId' });

