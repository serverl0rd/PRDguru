import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="Create PRDs with AI - Transform your product ideas into professional requirement documents" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
