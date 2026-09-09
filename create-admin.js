require('dotenv').config();
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/lib/sequelize.ts
var import_sequelize = require("sequelize");
var globalForSequelize = globalThis;
var sequelize = globalForSequelize.sequelize || new import_sequelize.Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    freezeTableName: true
  }
});
if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

// src/models/index.ts
var models_exports = {};
__export(models_exports, {
  Account: () => Account,
  ActivityLog: () => ActivityLog,
  BlogPost: () => BlogPost,
  Chapter: () => Chapter,
  ClassEnrollment: () => ClassEnrollment,
  ContactMessage: () => ContactMessage,
  Coupon: () => Coupon,
  Course: () => Course,
  Lesson: () => Lesson,
  LessonProgress: () => LessonProgress,
  LiveClass: () => LiveClass,
  Membership: () => Membership,
  NextAuthSession: () => NextAuthSession,
  Notification: () => Notification,
  OnboardingStatusEnum: () => OnboardingStatusEnum,
  Order: () => Order,
  PasswordResetToken: () => PasswordResetToken,
  Payment: () => Payment,
  PaymentTransaction: () => PaymentTransaction,
  PlatformSetting: () => PlatformSetting,
  Review: () => Review,
  RoleEnum: () => RoleEnum,
  SeoMetadata: () => SeoMetadata,
  User: () => User,
  WebhookEvent: () => WebhookEvent
});
var import_sequelize2 = require("sequelize");
var RoleEnum = {
  ADMIN: "ADMIN",
  TUTOR: "TUTOR",
  STUDENT: "STUDENT"
};
var OnboardingStatusEnum = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  UNDER_REVIEW: "UNDER_REVIEW",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  APPROVED: "APPROVED"
};
var User = class extends import_sequelize2.Model {
};
var Account = class extends import_sequelize2.Model {
};
var NextAuthSession = class extends import_sequelize2.Model {
};
var Membership = class extends import_sequelize2.Model {
};
var LiveClass = class extends import_sequelize2.Model {
};
var ClassEnrollment = class extends import_sequelize2.Model {
};
var Order = class extends import_sequelize2.Model {
};
var Payment = class extends import_sequelize2.Model {
};
var PaymentTransaction = class extends import_sequelize2.Model {
};
var WebhookEvent = class extends import_sequelize2.Model {
};
var Notification = class extends import_sequelize2.Model {
};
var ActivityLog = class extends import_sequelize2.Model {
};
var PlatformSetting = class extends import_sequelize2.Model {
};
var ContactMessage = class extends import_sequelize2.Model {
};
var BlogPost = class extends import_sequelize2.Model {
};
var SeoMetadata = class extends import_sequelize2.Model {
};
var PasswordResetToken = class extends import_sequelize2.Model {
};
var Review = class extends import_sequelize2.Model {
};
var Coupon = class extends import_sequelize2.Model {
};
var Course = class extends import_sequelize2.Model {
};
var Chapter = class extends import_sequelize2.Model {
};
var Lesson = class extends import_sequelize2.Model {
};
var LessonProgress = class extends import_sequelize2.Model {
};
User.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  email: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: import_sequelize2.DataTypes.STRING
  },
  emailVerified: {
    type: import_sequelize2.DataTypes.DATE
  },
  image: {
    type: import_sequelize2.DataTypes.STRING
  },
  password: {
    type: import_sequelize2.DataTypes.STRING
  },
  role: {
    type: import_sequelize2.DataTypes.STRING
  },
  isActive: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  onboardingStatus: {
    type: import_sequelize2.DataTypes.STRING
  },
  phone: {
    type: import_sequelize2.DataTypes.STRING
  },
  timezone: {
    type: import_sequelize2.DataTypes.STRING
  },
  bio: {
    type: import_sequelize2.DataTypes.TEXT
  },
  experience: {
    type: import_sequelize2.DataTypes.TEXT
  },
  qualifications: {
    type: import_sequelize2.DataTypes.TEXT
  },
  languages: {
    type: import_sequelize2.DataTypes.STRING
  },
  teachingHeadline: {
    type: import_sequelize2.DataTypes.STRING
  },
  teachingLevels: {
    type: import_sequelize2.DataTypes.STRING
  },
  teachingAges: {
    type: import_sequelize2.DataTypes.STRING
  },
  teachingStyle: {
    type: import_sequelize2.DataTypes.STRING
  },
  isApproved: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "User"
});
Account.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  userId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  provider: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  providerAccountId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  refresh_token: {
    type: import_sequelize2.DataTypes.TEXT
  },
  access_token: {
    type: import_sequelize2.DataTypes.TEXT
  },
  expires_at: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  token_type: {
    type: import_sequelize2.DataTypes.STRING
  },
  scope: {
    type: import_sequelize2.DataTypes.STRING
  },
  id_token: {
    type: import_sequelize2.DataTypes.TEXT
  },
  session_state: {
    type: import_sequelize2.DataTypes.STRING
  }
}, {
  sequelize,
  modelName: "Account",
  timestamps: false
});
NextAuthSession.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  sessionToken: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  expires: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "NextAuthSession",
  timestamps: false
});
Membership.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: import_sequelize2.DataTypes.DATE
  },
  validUntil: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  maxClasses: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  usedClasses: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Membership"
});
LiveClass.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  tutorId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: import_sequelize2.DataTypes.TEXT
  },
  scheduledAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  },
  meetingUrl: {
    type: import_sequelize2.DataTypes.STRING
  },
  recordingUrl: {
    type: import_sequelize2.DataTypes.TEXT
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  reminderSent24h: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  reminderSent2h: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "LiveClass"
});
ClassEnrollment.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  sessionId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "ClassEnrollment"
});
Order.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  membershipId: {
    type: import_sequelize2.DataTypes.STRING
  },
  couponId: {
    type: import_sequelize2.DataTypes.STRING
  },
  amount: {
    type: import_sequelize2.DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: import_sequelize2.DataTypes.STRING
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Order"
});
Payment.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  orderId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: import_sequelize2.DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: import_sequelize2.DataTypes.STRING
  },
  merchantTransactionId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  phonepeTransactionId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Payment"
});
PaymentTransaction.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  paymentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  rawData: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  }
}, {
  sequelize,
  modelName: "PaymentTransaction"
});
WebhookEvent.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  source: {
    type: import_sequelize2.DataTypes.STRING
  },
  eventId: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  eventType: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  payload: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  },
  error: {
    type: import_sequelize2.DataTypes.TEXT
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "WebhookEvent"
});
Notification.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  userId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  relatedId: {
    type: import_sequelize2.DataTypes.STRING
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  }
}, {
  sequelize,
  modelName: "Notification"
});
ActivityLog.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  actorId: {
    type: import_sequelize2.DataTypes.STRING
  },
  action: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  entityType: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  entityId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  oldValue: {
    type: import_sequelize2.DataTypes.TEXT
  },
  newValue: {
    type: import_sequelize2.DataTypes.TEXT
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  }
}, {
  sequelize,
  modelName: "ActivityLog"
});
PlatformSetting.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  key: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  value: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: import_sequelize2.DataTypes.STRING
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "PlatformSetting"
});
ContactMessage.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  name: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  studyPreference: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  status: {
    type: import_sequelize2.DataTypes.STRING
  }
}, {
  sequelize,
  modelName: "ContactMessage"
});
BlogPost.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  content: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: import_sequelize2.DataTypes.TEXT
  },
  coverImage: {
    type: import_sequelize2.DataTypes.STRING
  },
  published: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  authorId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: import_sequelize2.DataTypes.STRING
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "BlogPost"
});
SeoMetadata.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  pagePath: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: import_sequelize2.DataTypes.TEXT
  },
  keywords: {
    type: import_sequelize2.DataTypes.STRING
  },
  ogImage: {
    type: import_sequelize2.DataTypes.STRING
  },
  canonicalUrl: {
    type: import_sequelize2.DataTypes.STRING
  },
  ogTitle: {
    type: import_sequelize2.DataTypes.STRING
  },
  ogDescription: {
    type: import_sequelize2.DataTypes.TEXT
  },
  headerScripts: {
    type: import_sequelize2.DataTypes.TEXT
  },
  footerScripts: {
    type: import_sequelize2.DataTypes.TEXT
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "SeoMetadata"
});
PasswordResetToken.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  email: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  expires: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  }
}, {
  sequelize,
  modelName: "PasswordResetToken"
});
Review.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  tutorId: {
    type: import_sequelize2.DataTypes.STRING
  },
  rating: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  content: {
    type: import_sequelize2.DataTypes.TEXT,
    allowNull: false
  },
  isActive: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Review"
});
Coupon.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  code: {
    type: import_sequelize2.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: import_sequelize2.DataTypes.TEXT
  },
  discountType: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  discountValue: {
    type: import_sequelize2.DataTypes.FLOAT,
    allowNull: false
  },
  maxUses: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  usedCount: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  validUntil: {
    type: import_sequelize2.DataTypes.DATE
  },
  isActive: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Coupon"
});
Course.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: import_sequelize2.DataTypes.TEXT
  },
  coverImage: {
    type: import_sequelize2.DataTypes.STRING
  },
  isPublished: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Course"
});
Chapter.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  courseId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Chapter"
});
Lesson.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  chapterId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  videoUrl: {
    type: import_sequelize2.DataTypes.STRING
  },
  content: {
    type: import_sequelize2.DataTypes.TEXT
  },
  order: {
    type: import_sequelize2.DataTypes.INTEGER,
    allowNull: false
  },
  isPublished: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  duration: {
    type: import_sequelize2.DataTypes.INTEGER
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Lesson"
});
LessonProgress.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  studentId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  lessonId: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  isCompleted: {
    type: import_sequelize2.DataTypes.BOOLEAN
  },
  createdAt: {
    type: import_sequelize2.DataTypes.DATE
  },
  updatedAt: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "LessonProgress"
});
ClassEnrollment.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(ClassEnrollment, { as: "enrollments", foreignKey: "studentId" });
ClassEnrollment.belongsTo(LiveClass, { as: "session", foreignKey: "sessionId" });
LiveClass.hasMany(ClassEnrollment, { as: "enrollments", foreignKey: "sessionId" });
LiveClass.belongsTo(User, { as: "tutor", foreignKey: "tutorId" });
User.hasMany(LiveClass, { as: "taughtClasses", foreignKey: "tutorId" });
Order.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(Order, { as: "orders", foreignKey: "studentId" });
Order.belongsTo(Membership, { as: "membership", foreignKey: "membershipId" });
Membership.hasMany(Order, { as: "orders", foreignKey: "membershipId" });

// src/scripts/create-admin.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var { User: User2 } = models_exports;
async function createAdmin() {
  try {
    console.log("Authenticating with database...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const email = "admin@shreefertilityacademy.com";
    const password = "Admin@123!";
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    const [admin, created] = await User2.findOrCreate({
      where: { email },
      defaults: {
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
        isApproved: true
      }
    });
    if (created) {
      console.log(`Successfully created new admin user: ${email} with password: ${password}`);
    } else {
      console.log(`Admin user ${email} already exists. Updating password...`);
      await admin.update({ password: hashedPassword, role: "ADMIN", isApproved: true });
      console.log(`Successfully updated admin user: ${email} with password: ${password}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Unable to create admin:", error);
    process.exit(1);
  }
}
createAdmin();
