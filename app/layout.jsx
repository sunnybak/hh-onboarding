import "@/styles/globals.css";


export const metadata = {
  title: "MedFlow",
  description: "Connecting patients with volunteers.",
};

const RootLayout = ({ children }) => (
  <html lang='en' className="h-screen">
    <body className="h-screen">
      <div id="root" className="h-screen">
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
