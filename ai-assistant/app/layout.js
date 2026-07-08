export const metadata = {
  title: "AI Assistant",
  description: "AI Assistant with image generation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>{children}</body>
    </html>
  );
}
