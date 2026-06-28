# NovaEdge Digital Labs - Backend Integration Capabilities

This document outlines everything that can be controlled, modified, added, and managed through the NovaEdge Digital Labs Backend API and Database. 

As an Admin or through the backend systems, you have full control over the following domains of the platform:

## 1. User & Authentication Management
*   **Users & Roles:** View, create, edit, or ban users (Seekers, Employers, Freelancers).
*   **Admin Access:** Grant admin privileges to manage the platform.
*   **Profile Management:** Access detailed user profiles (Company Profiles, Freelancer Profiles) and verify accounts (e.g., granting "Premium" or "Verified" badges).

## 2. Courses & Educational Content
*   **Course Management:** Add new courses, update content (videos, PDFs, descriptions), and unpublish outdated courses.
*   **Course Enrollments & Purchases:** Track which users have purchased which courses, track their progress, and manage refunds or manual enrollments.

## 3. Job Board & Freelance Marketplace
*   **Job Listings:** Moderate, approve, or delete jobs posted by employers. Support for Featured Jobs (Priority placement).
*   **Job Applications:** Track candidate applications for specific jobs.
*   **Freelance Gigs & Proposals:** Manage available freelance gigs and monitor proposals submitted by freelancers.
*   **Contracts & Escrow:** Manage active freelance contracts and view Escrow transactions (funds held until project completion).

## 4. Digital Store & Marketplace
*   **Products & Services:** Add digital products (e.g., templates, software) or services to the store. Update pricing, descriptions, and thumbnails.
*   **Purchases & Order History:** View all digital goods purchased by users.
*   **Reviews & Ratings:** Moderate product reviews and ratings submitted by users.

## 5. Payments, Subscriptions & Monetization
*   **Payment Gateway Integration:** Integrated with Razorpay to track all transactions, successful payments, and failed attempts.
*   **Platform Subscriptions:** Manage user subscription plans (e.g., monthly premium access).
*   **Premium Placements:** Control "Premium Job Seeker" visibility and "Featured Listings" for businesses and individuals wanting higher visibility.

## 6. Business Inquiries & Leads
*   **Business Inquiries:** Receive and manage B2B inquiries directly in the database.
*   **Lead Generation:** Track leads gathered from various platform interactions, and export them for CRM usage.
*   **Email Notifications:** Automated email sending (e.g., admin notifications for new inquiries) via NodeMailer.

## 7. Affiliate & Marketing System
*   **Affiliate Links:** Generate, track, and manage affiliate links.
*   **Affiliate Clicks & Conversions:** Monitor how many clicks and conversions came from specific affiliates to calculate payouts.

## 8. Developer API & Tools
*   **API Key Management:** Generate and revoke API keys for developers using your public API.
*   **API Call Logs & Analytics:** Track API usage and rate limits (`ApiCallLog`).
*   **Tool Usage & Configurations:** Monitor which AI tools or internal tools are being used most by users (`ToolUsage`). Manage dynamic platform configurations (`PlatformConfig`).

## 9. Communication
*   **Messaging System:** Monitor the internal chat/messaging system between employers and freelancers.

---

### 💡 What you can do next with this backend:
1.  **Build an Admin Dashboard (Web App):** Connect a React/Next.js frontend to these APIs to create a beautiful admin panel where you can visualize and manage all this data without touching the database directly.
2.  **Advanced Analytics:** Use the `Analytics` and `ToolUsage` models to generate weekly reports on revenue, active users, and course completions.
3.  **Automated Workflows:** Set up cron jobs to automatically email users whose subscriptions are expiring, or send weekly job digests.

---

## 🚀 Currently Implemented in Admin Panel (Live Features)
Based on the current backend setup (`admin.controller.js`), the following controls and features are **already fully functioning and accessible** via the Admin APIs/Panel:

1. **Platform Settings & Health**
   - View and update global platform configurations (Maintenance mode, default settings).
   - Check System Health and get overall Dashboard Statistics (Revenue, Active Users, etc.).
   - View detailed Analytics and manually refresh Analytics data.

2. **User Management**
   - Fetch all users, Create new users manually, Update user details/roles, and Delete/Ban users.

3. **Digital Store (Products & Services)**
   - **Products:** Fetch all products, Create, Update, and Delete digital products.
   - **Services:** Fetch all services, Create, Update, and Delete services.

4. **Courses Management**
   - Fetch all courses, Create new courses, Update existing courses, and Delete courses.

5. **Leads & Business Inquiries**
   - **Leads:** View all captured leads and update their status (e.g., from 'New' to 'Contacted').
   - **Inquiries:** View all business inquiries and update their status (e.g., 'Pending', 'Resolved').

6. **Job Board Management**
   - View all job listings, Update job statuses (Approve/Reject/Close), and Delete job listings.

7. **Freelance Network (Gigs & Projects)**
   - View all freelance work (Projects and Gigs).
   - Update and Delete Projects.
   - Update and Delete Gigs.

8. **Developer API Keys**
   - View all generated API keys.
   - Create new Admin API keys and Revoke existing API keys.
