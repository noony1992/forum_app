import { Html, Head, Main, NextScript } from 'next/document'
import 'flowbite';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js"></script>
      </body>
    </Html>
  )
}
