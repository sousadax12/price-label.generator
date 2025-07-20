# Price Label Generator

A modern web application designed for retail food businesses to manage product inventory and generate professional price labels for printing. Built specifically for Portuguese markets with support for various food categories and euro pricing.

## Features

- **Product Management**: Create, edit, delete, and organize products by food categories
- **Label Generation**: Generate professional price labels in two sizes (8x5cm and 6.5x3.5cm)
- **Category Support**: Specialized for food retail with 10+ categories (VACA, QUEIJO, MERCEARIA, etc.)
- **Print System**: Select products and print labels in optimized layouts for retail use
- **Authentication**: Secure user authentication with Firebase
- **Real-time Database**: Product data synchronized with Firebase Firestore
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Fully typed for better development experience
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Product Categories

The application supports the following food categories with custom icons:

- **VACA** - Beef/Cow products
- **QUEIJO** - Cheese products  
- **MERCEARIA** - Grocery items
- **PORCO** - Pork products
- **AVE** - Poultry products
- **BORREGO** - Lamb products
- **CABRITO** - Goat products
- **CHARCUTARIA** - Charcuterie/Deli products
- **COELHO** - Rabbit products
- **GERAL** - General products

## Usage

1. **Sign In**: Access the application with your credentials
2. **Manage Products**: Add, edit, or delete products with pricing and category information
3. **Select for Print**: Use checkboxes to select which products need labels
4. **Generate Labels**: Navigate to the print page to preview your labels
5. **Print**: Use your browser's print function to output labels on paper

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Firebase project with Firestore and Authentication enabled

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd price-label-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (see Firebase Setup section below)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to access the application

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with TypeScript
- **Firebase 11** - Authentication and Firestore database
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library with Radix UI primitives
- **Lucide React** - Icon library

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── labels/            # Main product management page
│   ├── print/             # Label printing page
│   └── signin/            # Authentication page
├── components/
│   └── ui/                # shadcn/ui components
├── context/
│   └── AuthContext.tsx    # Firebase authentication context
├── firebase/              # Firebase configuration and services
│   ├── config.ts          # Firebase initialization
│   ├── auth/              # Authentication functions
│   └── firestore/         # Database operations
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Deploy on Vercel

1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your Firebase environment variables in Vercel's dashboard
4. Deploy with automatic builds on every push

## Set Up Firebase

<https://console.firebase.google.com/>

- Log in with your Google account.
- Click on `Go to console` button.
- Click `Add Project` card.
- Give your project a name.
- Click on `Continue` button.
- Disable `Google Analytics for this project` (unless you wish to use it).
- Click `Create project` button.
- Click on the web icon button to create your web app. It will show a text popup `Web`.
- Register app by giving it a nickname and click `Register app` button.
- Where package.json is located, in your cli, type `npm i firebase`.
- Copy configuration file. Make a new file in `src` called `firebase` called `firebase.js`.
- In project root, create a file and name it `.env`.
- Make sure you add `.env.local` to your `.gitignore` so you don't expose your variables in git repo.
- Follow the instructions here at <https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#loading-environment-variables> to add your variables from firebase.js into this file.

Example...

```md
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

- Create `env` file and paste these variables with your own information.
- Click on `Continue on console` button
- On your project homepage, choose a product to add to your app. First, click on `Authentication`.
- Under `Get started with Firebase Auth by adding your first sign-in method` select `Email/Password`.

You should now be setup to use Firebase.

## Development Commands

```bash
# Development server
npm run dev

# Production build  
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions about using this application for your retail business, please open an issue in the repository.
