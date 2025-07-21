'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="mt-20 border-t pt-10 pb-6 text-sm text-center text-gray-500 dark:text-gray-400">
            <p>
                Made with ❤️ by{' '}
                <a
                    href="https://arijitkar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    Arijit Kar
                </a>
            </p>
            <p className="mt-2">
                View the code on{' '}
                <a
                    href="https://github.com/DemonicAK/PocketPortrait-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    GitHub
                </a>{' '}
                · Connect on{' '}
                <a
                    href="https://linkedin.com/in/arijitkar0x7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    LinkedIn
                </a>
            </p>
        </footer>
    );
}
