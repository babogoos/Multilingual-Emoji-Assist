# Emoji Assist

Emoji Assist is a web application that uses AI to suggest the perfect emoji for your text. It supports multiple languages and is powered by Gemini 1.5 Flash and Firebase.

## Features

*   **AI-powered emoji suggestions:** Get relevant emoji suggestions for your text.
*   **Multi-language support:** Works with various languages.
*   **Simple and intuitive interface:** Easy to use for everyone.

## Technologies Used

*   **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend:** [Genkit](https://firebase.google.com/docs/genkit)
*   **AI Model:** [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/flash/)
*   **Hosting:** [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/google/emoji-assist.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

1.  Start the development server
    ```sh
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed on Firebase Hosting. To deploy your own version, you can use the Firebase CLI.

1.  Install the Firebase CLI
    ```sh
    npm install -g firebase-tools
    ```
2.  Login to Firebase
    ```sh
    firebase login
    ```
3.  Initialize Firebase in your project
    ```sh
    firebase init
    ```
4.  Deploy to Firebase Hosting
    ```sh
    firebase deploy --only hosting
    ```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Developer

This project was developed by [Dion Chang](https://www.linkedin.com/in/dionchangtw/).
