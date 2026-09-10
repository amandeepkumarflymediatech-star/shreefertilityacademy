"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
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

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// src/lib/schema.ts
var import_dotenv = __toESM(require_main());

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

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
  PricingPackage: () => PricingPackage,
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
var PricingPackage = class extends import_sequelize2.Model {
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
PricingPackage.init({
  id: {
    type: import_sequelize2.DataTypes.STRING,
    primaryKey: true,
    defaultValue: import_sequelize2.DataTypes.UUIDV4
  },
  title: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: import_sequelize2.DataTypes.FLOAT,
    allowNull: false
  },
  regularPrice: {
    type: import_sequelize2.DataTypes.FLOAT
  },
  classCount: {
    type: import_sequelize2.DataTypes.INTEGER,
    defaultValue: 12
  },
  tagline: {
    type: import_sequelize2.DataTypes.STRING
  },
  validTill: {
    type: import_sequelize2.DataTypes.DATE,
    allowNull: true
  },
  features: {
    type: import_sequelize2.DataTypes.TEXT
  },
  isActive: {
    type: import_sequelize2.DataTypes.BOOLEAN,
    defaultValue: true
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
  modelName: "PricingPackage"
});
ClassEnrollment.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(ClassEnrollment, { as: "enrollments", foreignKey: "studentId" });
ClassEnrollment.belongsTo(LiveClass, { as: "session", foreignKey: "sessionId" });
LiveClass.hasMany(ClassEnrollment, { as: "enrollments", foreignKey: "sessionId" });
LiveClass.belongsTo(User, { as: "tutor", foreignKey: "tutorId" });
User.hasMany(LiveClass, { as: "taughtClasses", foreignKey: "tutorId" });
Order.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(Order, { as: "orders", foreignKey: "studentId" });
Order.belongsTo(PricingPackage, { as: "package", foreignKey: "membershipId", constraints: false });
PricingPackage.hasMany(Order, { as: "orders", foreignKey: "membershipId", constraints: false });
Order.belongsTo(Membership, { as: "membership", foreignKey: "membershipId", constraints: false });
Membership.hasMany(Order, { as: "orders", foreignKey: "membershipId", constraints: false });
Order.hasOne(Payment, { as: "payment", foreignKey: "orderId" });
Payment.belongsTo(Order, { as: "order", foreignKey: "orderId" });
Order.belongsTo(Coupon, { as: "coupon", foreignKey: "couponId" });
Coupon.hasMany(Order, { as: "orders", foreignKey: "couponId" });
Membership.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(Membership, { as: "memberships", foreignKey: "studentId" });
Payment.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(Payment, { as: "payments", foreignKey: "studentId" });
BlogPost.belongsTo(User, { as: "author", foreignKey: "authorId" });
User.hasMany(BlogPost, { as: "blogPosts", foreignKey: "authorId" });
Review.belongsTo(User, { as: "tutor", foreignKey: "tutorId" });
Review.belongsTo(User, { as: "student", foreignKey: "studentId" });
User.hasMany(Review, { as: "receivedReviews", foreignKey: "tutorId" });
User.hasMany(Review, { as: "givenReviews", foreignKey: "studentId" });
Chapter.belongsTo(Course, { as: "course", foreignKey: "courseId" });
Course.hasMany(Chapter, { as: "chapters", foreignKey: "courseId" });
Lesson.belongsTo(Chapter, { as: "chapter", foreignKey: "chapterId" });
Chapter.hasMany(Lesson, { as: "lessons", foreignKey: "chapterId" });
LessonProgress.belongsTo(User, { as: "student", foreignKey: "studentId" });
LessonProgress.belongsTo(Lesson, { as: "lesson", foreignKey: "lessonId" });
User.hasMany(LessonProgress, { as: "lessonProgress", foreignKey: "studentId" });
Lesson.hasMany(LessonProgress, { as: "progressRecords", foreignKey: "lessonId" });

// src/lib/schema.ts
(0, import_dotenv.config)();
console.log(`Registered ${Object.keys(models_exports).length} models.`);
async function syncDatabase() {
  try {
    console.log("Authenticating with database...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log("Syncing database schema...");
    await sequelize.sync({ alter: true });
    console.log("Database schema synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to sync the database:", error);
    process.exit(1);
  }
}
syncDatabase();
