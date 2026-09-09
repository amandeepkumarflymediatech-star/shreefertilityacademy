const fs = require('fs');
const path = require('path');

const prismaSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf8');

const models = [];
const enums = [];

const lines = schemaContent.split('\n');
let currentModel = null;
let currentEnum = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('model ')) {
    const name = trimmed.split(' ')[1];
    currentModel = { name, fields: [] };
    models.push(currentModel);
  } else if (trimmed.startsWith('enum ')) {
    const name = trimmed.split(' ')[1];
    currentEnum = { name, values: [] };
    enums.push(currentEnum);
  } else if (trimmed === '}') {
    currentModel = null;
    currentEnum = null;
  } else if (currentModel && trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('@@')) {
    const parts = trimmed.split(/\s+/);
    const fieldName = parts[0];
    const fieldType = parts[1];
    if (fieldName && fieldType) {
      currentModel.fields.push({
        name: fieldName,
        type: fieldType,
        raw: trimmed
      });
    }
  } else if (currentEnum && trimmed && !trimmed.startsWith('//')) {
    currentEnum.values.push(trimmed);
  }
}

// Generate src/models/index.ts
let out = `import { DataTypes, Model, Optional } from 'sequelize';\nimport { sequelize } from '../lib/sequelize';\n\n`;

for (const enm of enums) {
  out += `export const ${enm.name}Enum = {\n`;
  for (const val of enm.values) {
    out += `  ${val}: '${val}',\n`;
  }
  out += `};\n\n`;
}

for (const model of models) {
  out += `export interface ${model.name}Attributes {\n`;
  for (const field of model.fields) {
    const isOptional = field.type.endsWith('?') || field.raw.includes('@default');
    const tsType = field.type.replace('?', '') === 'String' ? 'string' : 
                   field.type.replace('?', '') === 'Int' ? 'number' : 
                   field.type.replace('?', '') === 'Float' ? 'number' : 
                   field.type.replace('?', '') === 'Boolean' ? 'boolean' : 
                   field.type.replace('?', '') === 'DateTime' ? 'Date' : 'any'; // simplistic
    // Relations are arrays or single types, skip relations in basic attributes for now
    if (['User', 'Account', 'NextAuthSession', 'Membership', 'LiveClass', 'ClassEnrollment', 'Order', 'Payment', 'PaymentTransaction', 'WebhookEvent', 'Notification', 'ActivityLog', 'PlatformSetting', 'ContactMessage', 'BlogPost', 'SeoMetadata', 'PasswordResetToken', 'Review', 'Coupon', 'Course', 'Chapter', 'Lesson', 'LessonProgress'].includes(field.type.replace('?', '').replace('[]', ''))) {
      continue;
    }
    
    out += `  ${field.name}${isOptional ? '?' : ''}: ${tsType};\n`;
  }
  out += `}\n\n`;

  out += `export interface ${model.name}CreationAttributes extends Optional<${model.name}Attributes, 'id'> {}\n\n`;

  out += `export class ${model.name} extends Model<${model.name}Attributes, ${model.name}CreationAttributes> implements ${model.name}Attributes {\n`;
  for (const field of model.fields) {
    if (['User', 'Account', 'NextAuthSession', 'Membership', 'LiveClass', 'ClassEnrollment', 'Order', 'Payment', 'PaymentTransaction', 'WebhookEvent', 'Notification', 'ActivityLog', 'PlatformSetting', 'ContactMessage', 'BlogPost', 'SeoMetadata', 'PasswordResetToken', 'Review', 'Coupon', 'Course', 'Chapter', 'Lesson', 'LessonProgress'].includes(field.type.replace('?', '').replace('[]', ''))) {
      continue;
    }
    out += `  public ${field.name}!: any;\n`; // simplistic
  }
  out += `}\n\n`;
}

// Generate init calls
for (const model of models) {
  out += `${model.name}.init({\n`;
  for (const field of model.fields) {
    if (['User', 'Account', 'NextAuthSession', 'Membership', 'LiveClass', 'ClassEnrollment', 'Order', 'Payment', 'PaymentTransaction', 'WebhookEvent', 'Notification', 'ActivityLog', 'PlatformSetting', 'ContactMessage', 'BlogPost', 'SeoMetadata', 'PasswordResetToken', 'Review', 'Coupon', 'Course', 'Chapter', 'Lesson', 'LessonProgress'].includes(field.type.replace('?', '').replace('[]', ''))) {
      continue;
    }

    const typeStr = field.type.replace('?', '');
    let seqType = 'DataTypes.STRING';
    if (typeStr === 'Int') seqType = 'DataTypes.INTEGER';
    else if (typeStr === 'Float') seqType = 'DataTypes.FLOAT';
    else if (typeStr === 'Boolean') seqType = 'DataTypes.BOOLEAN';
    else if (typeStr === 'DateTime') seqType = 'DataTypes.DATE';
    else if (field.raw.includes('@db.Text') || field.raw.includes('@db.LongText')) seqType = 'DataTypes.TEXT';

    out += `  ${field.name}: {\n    type: ${seqType},\n`;
    if (field.raw.includes('@id')) out += `    primaryKey: true,\n`;
    if (field.raw.includes('@default(uuid())') || field.raw.includes('@default(cuid())')) out += `    defaultValue: DataTypes.UUIDV4,\n`;
    if (field.raw.includes('@unique')) out += `    unique: true,\n`;
    if (!field.type.endsWith('?') && !field.raw.includes('@default')) out += `    allowNull: false,\n`;
    out += `  },\n`;
  }
  out += `}, {\n  sequelize,\n  modelName: '${model.name}',\n});\n\n`;
}

// Write to file
const outputPath = path.join(__dirname, 'src', 'models', 'index.ts');
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}
fs.writeFileSync(outputPath, out);
console.log('Done generating basic models.');
