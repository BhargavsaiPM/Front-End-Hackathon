const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../database/support_system.db');
const schemaPath = path.join(__dirname, '../database/schema.sql');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database');
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.log('Database file is locked. Please close any connections and try again.');
      console.log('Continuing with existing database...');
      process.exit(0);
    } else {
      throw err;
    }
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  }
  console.log('Database created successfully');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema, (err) => {
  if (err) {
    console.error('Error executing schema:', err.message);
    process.exit(1);
  }
  console.log('Schema executed successfully');
  
  // Create default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const adminEmail = 'admin@support.org';
  
  db.run(
    `INSERT INTO users (anonymous_id, email, password_hash, role) 
     VALUES (?, ?, ?, ?)`,
    ['ADMIN-001', adminEmail, adminPassword, 'admin'],
    function(err) {
      if (err) {
        console.error('Error creating admin user:', err.message);
      } else {
        console.log('Default admin user created:');
        console.log('  Email: admin@support.org');
        console.log('  Password: admin123');
        console.log('  Anonymous ID: ADMIN-001');
      }
      
      // Create sample counsellor
      const counsellorPassword = bcrypt.hashSync('counsellor123', 10);
      db.run(
        `INSERT INTO users (anonymous_id, email, password_hash, role, pseudonym) 
         VALUES (?, ?, ?, ?, ?)`,
        ['COUN-001', 'counsellor@support.org', counsellorPassword, 'counsellor', 'Dr. Sarah'],
        (err) => {
          if (err) console.error('Error creating sample counsellor:', err.message);
          else console.log('Sample counsellor created: counsellor@support.org / counsellor123');
        }
      );
      
      // Create sample legal advisor
      const legalPassword = bcrypt.hashSync('legal123', 10);
      db.run(
        `INSERT INTO users (anonymous_id, email, password_hash, role, pseudonym) 
         VALUES (?, ?, ?, ?, ?)`,
        ['LEGAL-001', 'legal@support.org', legalPassword, 'legal', 'Attorney John'],
        (err) => {
          if (err) console.error('Error creating sample legal advisor:', err.message);
          else console.log('Sample legal advisor created: legal@support.org / legal123');
        }
      );
      
      // Create sample resources
      const resources = [
        {
          title: 'National Domestic Violence Hotline',
          type: 'helpline',
          description: '24/7 confidential support for victims of domestic violence',
          link_or_number: '1-800-799-7233',
          category: 'Emergency'
        },
        {
          title: 'Understanding Domestic Violence',
          type: 'online_resource',
          description: 'Comprehensive guide to recognizing and understanding domestic violence',
          link_or_number: 'https://example.com/understanding-dv',
          category: 'Education'
        },
        {
          title: 'Your Legal Rights',
          type: 'legal_info',
          description: 'Information about legal rights and protection orders',
          link_or_number: 'https://example.com/legal-rights',
          category: 'Legal Rights'
        },
        {
          title: 'Health Risks of Domestic Violence',
          type: 'health_info',
          description: 'Physical and mental health risks associated with domestic abuse',
          link_or_number: 'https://example.com/health-risks',
          category: 'Health'
        }
      ];
      
      resources.forEach((resource, index) => {
        db.run(
          `INSERT INTO resources (title, type, description, link_or_number, category, created_by_admin_id) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [resource.title, resource.type, resource.description, resource.link_or_number, resource.category, 1],
          (err) => {
            if (err) console.error(`Error creating resource ${index + 1}:`, err.message);
          }
        );
      });
      
      // Initialize availability for counsellor and legal advisor
      db.run(
        `INSERT INTO availability (user_id, status, note) VALUES (?, ?, ?)`,
        [2, 'available', 'Available Monday-Friday, 9 AM - 5 PM'],
        (err) => {
          if (err) console.error('Error setting counsellor availability:', err.message);
        }
      );
      
      db.run(
        `INSERT INTO availability (user_id, status, note) VALUES (?, ?, ?)`,
        [3, 'available', 'Available Monday-Friday, 10 AM - 6 PM'],
        (err) => {
          if (err) console.error('Error setting legal advisor availability:', err.message);
          else {
            console.log('\nDatabase initialization complete!');
            db.close();
          }
        }
      );
    }
  );
});

