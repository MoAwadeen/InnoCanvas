# 🛡️ InnoCanvas Admin Dashboard Setup Guide

## 📋 Overview

The InnoCanvas Admin Dashboard provides comprehensive management capabilities for your platform, including user management, subscription monitoring, canvas oversight, and system configuration.

## 🚀 Quick Setup

### 1. Database Setup

First, run the admin role SQL script to add the necessary database functionality:

```sql
-- Run this in your Supabase SQL Editor
-- Copy and paste the contents of add-admin-role.sql
```

This script will:
- Add a `role` column to the profiles table
- Create admin management functions
- Set up RLS policies for admin access
- Create system settings and activity logging tables
- Automatically promote the first registered user to admin

### 2. Access the Admin Dashboard

Once the database is set up:

1. **First User**: The first user to register will automatically become an admin
2. **Access URL**: Navigate to `/admin` in your application
3. **Authentication**: Only users with `role = 'admin'` can access admin pages

## 🎯 Admin Dashboard Features

### **Main Dashboard** (`/admin`)
- **Overview Statistics**: Total users, subscriptions, canvases, revenue
- **Recent Activity**: Latest user signups and canvas creations
- **System Status**: Database, AI service, payment gateway health
- **Quick Actions**: Direct links to management sections

### **User Management** (`/admin/users`)
- **User List**: View all registered users with search and filtering
- **User Details**: View comprehensive user information
- **Role Management**: Promote/demote users to admin role
- **User Actions**: Delete users (with confirmation)
- **Export Data**: Download user data as CSV

### **Subscription Management** (`/admin/subscriptions`)
- **Subscription Overview**: Active subscriptions, revenue metrics
- **Subscription Details**: View individual subscription information
- **Filtering**: Filter by status, plan, date range
- **Export**: Download subscription data as CSV

### **Canvas Management** (`/admin/canvases`)
- **Canvas List**: View all user-created canvases
- **Canvas Details**: View full canvas content and metadata
- **Search & Filter**: Find canvases by title, user, visibility
- **Canvas Actions**: Delete inappropriate content
- **Analytics**: Canvas creation trends and statistics

### **System Settings** (`/admin/settings`)
- **Platform Configuration**: Maintenance mode, registration settings
- **Feature Management**: AI model selection, language settings
- **Usage Limits**: Configure canvas limits for different plans
- **Integration Status**: Monitor third-party service connections
- **System Monitoring**: Real-time metrics and alerts

## 🔧 Database Functions

### Admin Role Management

```sql
-- Check if user is admin
SELECT is_admin('user-uuid-here');

-- Promote user to admin (admin only)
SELECT promote_to_admin('target-user-uuid', 'admin-user-uuid');

-- Demote admin to user (admin only)
SELECT demote_from_admin('target-user-uuid', 'admin-user-uuid');
```

### System Settings

```sql
-- Get system setting
SELECT get_system_setting('maintenance_mode');

-- Update system setting (admin only)
SELECT update_system_setting('maintenance_mode', 'true', 'admin-user-uuid');
```

### Activity Logging

```sql
-- Log admin activity
SELECT log_admin_activity(
    'admin-user-uuid',
    'user_deleted',
    'user',
    'deleted-user-uuid',
    '{"reason": "violation"}'
);
```

## 🛡️ Security Features

### Row Level Security (RLS)
- **Admin-only access** to sensitive data
- **User isolation** - users can only see their own data
- **Admin override** - admins can view and manage all data

### Activity Logging
- **Audit trail** for all admin actions
- **IP tracking** for security monitoring
- **Action details** stored for compliance

### Role-based Access Control
- **Admin role** required for dashboard access
- **Function-level security** for database operations
- **Self-protection** - admins cannot demote themselves

## 📊 Available Statistics

### User Metrics
- Total registered users
- Active subscriptions
- New users this month
- Email verification status
- User conversion rates

### Subscription Metrics
- Active subscription count
- Monthly recurring revenue
- Subscription status distribution
- Expiring subscriptions
- Plan distribution

### Canvas Metrics
- Total canvases created
- Public vs private canvases
- Canvases created today
- Average canvases per user
- Canvas creation trends

### System Metrics
- Database connection status
- AI service availability
- Payment gateway status
- Storage system health
- Error rates and alerts

## 🔄 System Settings

### Platform Settings
- **Maintenance Mode**: Restrict access to admins only
- **Registration**: Enable/disable new user registrations
- **Email Verification**: Require email verification for new accounts

### Feature Configuration
- **AI Model**: Select default AI model (GPT-4o-mini, GPT-4o, GPT-4-turbo)
- **Default Language**: Set platform default language
- **Timezone**: Configure default timezone

### Usage Limits
- **Free Plan**: Maximum canvases for free users (default: 3)
- **Pro Plan**: Maximum canvases for Pro users (default: 10)
- **Premium Plan**: Maximum canvases for Premium users (default: 999)

## 📈 Monitoring & Alerts

### System Health Monitoring
- **Database**: Connection status and performance
- **AI Service**: OpenAI API availability
- **Payment Gateway**: LemonSqueezy integration status
- **Storage**: Supabase storage availability

### Alert Types
- **Service Outages**: When external services are down
- **High Usage**: When approaching rate limits
- **Security Events**: Suspicious activity detection
- **Performance Issues**: Slow response times

## 🚨 Emergency Procedures

### Maintenance Mode
1. Go to `/admin/settings`
2. Enable "Maintenance Mode"
3. Add optional maintenance message
4. Only admins can access the platform

### User Management
1. **Suspend User**: Set subscription status to 'cancelled'
2. **Delete User**: Remove user and all their data
3. **Promote to Admin**: Give user admin privileges

### System Recovery
1. **Database Issues**: Check Supabase dashboard
2. **AI Service**: Verify OpenAI API key and quota
3. **Payment Issues**: Check LemonSqueezy webhook configuration

## 📝 Best Practices

### Security
- **Regular Audits**: Review admin activity logs monthly
- **Role Management**: Only promote trusted users to admin
- **Access Control**: Use strong passwords and 2FA
- **Monitoring**: Set up alerts for suspicious activity

### Data Management
- **Regular Backups**: Ensure database backups are configured
- **Data Export**: Export important data regularly
- **Cleanup**: Remove inactive users and old data
- **Compliance**: Follow data protection regulations

### Performance
- **Monitoring**: Track system performance metrics
- **Optimization**: Monitor and optimize database queries
- **Scaling**: Plan for user growth and system scaling
- **Updates**: Keep dependencies and security patches updated

## 🔗 Integration Status

### Connected Services
- ✅ **Supabase**: Database and authentication
- ✅ **OpenAI**: AI canvas generation
- ⚠️ **LemonSqueezy**: Payment processing (requires setup)
- ❌ **Google Analytics**: Analytics tracking (optional)

### Setup Requirements
1. **LemonSqueezy**: Complete payment gateway setup
2. **Google Analytics**: Add tracking code for analytics
3. **Email Service**: Configure email notifications
4. **Monitoring**: Set up external monitoring services

## 📞 Support & Troubleshooting

### Common Issues

#### Access Denied
- **Problem**: Cannot access admin dashboard
- **Solution**: Check user role in database, ensure role = 'admin'

#### Database Errors
- **Problem**: Admin functions not working
- **Solution**: Run the admin SQL script again, check RLS policies

#### Missing Data
- **Problem**: Dashboard shows no data
- **Solution**: Check database connections, verify table permissions

### Getting Help
1. **Check Logs**: Review admin activity logs for errors
2. **Database**: Verify Supabase connection and permissions
3. **Documentation**: Refer to this guide and SQL comments
4. **Support**: Contact technical support with error details

## 🎉 Success Metrics

### Key Performance Indicators
- **User Growth**: Monthly active users
- **Revenue**: Monthly recurring revenue
- **Engagement**: Average canvases per user
- **Retention**: User subscription renewal rates
- **Support**: Admin intervention frequency

### Monitoring Dashboard
- **Real-time Metrics**: Live user activity and system health
- **Trend Analysis**: Historical data and growth patterns
- **Alert System**: Automated notifications for issues
- **Performance Tracking**: System response times and availability

---

*This admin dashboard provides comprehensive management capabilities for your InnoCanvas platform. Regular monitoring and maintenance will ensure optimal performance and user experience.*
