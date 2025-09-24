# DriveLine Books - Multi-Business Bookkeeping Application

A comprehensive bookkeeping application designed specifically for transportation industry businesses, built with React and Supabase.

## Features

- **Multi-Business Management**: Manage multiple business entities from a single dashboard
- **Transportation Industry Focus**: Tailored for compliance, driver services, and logistics businesses
- **Comprehensive Accounting**: Full-featured bookkeeping including invoices, bills, payments, and reports
- **Real-time Data**: Built on Supabase for real-time updates and collaboration
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Business Entities Supported

- **Driveline Compliance**: DOT compliance and safety services
- **Driveline Solutions**: Driver recruitment and placement
- **SaferSAP**: SAP evaluation and compliance services
- **Driveline Chat**: AI-powered compliance assistance
- **Ask Rita**: AI recruiting assistant
- **SAP Drivers**: Driver placement services

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/driveline-books.git
cd driveline-books
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Update the `.env` file with your Supabase credentials.

4. Start the development server:
```bash
pnpm run dev
```

### Database Setup

The application uses Supabase as the backend. The database schema includes:

- Multi-tenant architecture with business isolation
- Row Level Security (RLS) for data protection
- Comprehensive accounting tables (invoices, bills, payments, etc.)
- Project-based accounting support
- Time tracking and billing
- Audit logging

## Key Features

### Dashboard
- Real-time business metrics
- Outstanding invoices and overdue alerts
- Recent transaction history
- Multi-business switching

### Invoicing
- Professional invoice generation
- Recurring invoice automation
- Payment tracking
- Customer management

### Bills & Expenses
- Vendor bill management
- Expense tracking with receipt capture
- Purchase order workflow
- Payment scheduling

### Reporting
- Financial statements
- Tax compliance reports
- Project profitability analysis
- Custom report generation

### Multi-Business Support
- Separate chart of accounts per business
- Consolidated reporting across entities
- Inter-company transaction tracking
- Role-based access control

## Industry-Specific Features

### Transportation Compliance
- DOT regulation tracking
- Driver qualification file management
- Safety performance monitoring
- Compliance cost allocation

### Driver Services
- Commission tracking for recruiters
- Placement fee management
- SAP evaluation billing
- Training cost tracking

### Subscription Services
- Recurring revenue tracking
- Churn analysis
- Usage-based billing
- Customer lifecycle management

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact:
- Email: support@drivelinecompliance.com
- Website: https://drivelinecompliance.com

## Roadmap

- [ ] Mobile application
- [ ] Advanced reporting and analytics
- [ ] API integrations (banks, payment processors)
- [ ] Automated bank reconciliation
- [ ] Advanced inventory management
- [ ] Multi-currency support enhancement
- [ ] Audit trail improvements
- [ ] Custom workflow automation
