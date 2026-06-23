export const metadata = {
  title: "Exam Beast",
  description: "AI Study + Focus App"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin:0,
        fontFamily:"Arial",
        background:"#0f172a",
        color:"white"
      }}>
        {children}
      </body>
    </html>
  );
}