import { Head } from "vite-react-ssg";

const GA4_ID = "G-G7W3J8HYQ5";

const AnalyticsScripts: React.FC = () => {
  if (!GA4_ID) return null;
  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
      <script>
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`}
      </script>
    </Head>
  );
};

export { AnalyticsScripts };
