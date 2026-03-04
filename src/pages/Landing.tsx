import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotCard } from "../components/ui/JackpotCard";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Landing() {
  const { t } = useTranslation();

  // Hardcoded or from env
  const whatsappNumber = "5583998377273";
  const whatsappMessage = encodeURIComponent(t("landing.whatsappMessage"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 stadium-pattern">
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-6 glow-primary">
            <span className="text-5xl leading-none">🎖️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gradient-primary mb-4 drop-shadow-md">
            {t("landing.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs mx-auto mb-2">
            {t("landing.subtitle")}
          </p>
        </div>

        <JackpotCard className="p-8 shadow-2xl bg-card/90 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-colors duration-500">
          <div className="space-y-6 flex flex-col">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group"
            >
              <JackpotButton
                variant="primary"
                className="w-full text-lg py-6 relative overflow-hidden flex items-center justify-center gap-3 transition-transform group-hover:scale-[1.02]"
              >
                {/* Minimalist WhatsApp Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 z-10"
                >
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.228.583 4.408 1.687 6.32L0 24l5.808-1.523A11.968 11.968 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.067a9.96 9.96 0 0 1-5.078-1.383l-.364-.216-3.774.99.99-3.68-.236-.376A9.957 9.957 0 0 1 2.062 12.03c0-5.503 4.48-9.983 9.983-9.983 5.502 0 9.983 4.48 9.983 9.983 0 5.503-4.48 9.984-9.983 9.984zm5.474-7.48c-.3-.15-1.774-.876-2.048-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.466-2.409-1.488-.89-.795-1.49-1.777-1.666-2.077-.175-.3-.02-.462.13-.612.135-.136.3-.3.45-.45.15-.15.2-.25.3-.412.1-.163.05-.312-.025-.462-.075-.15-.675-1.626-.925-2.226-.24-.582-.486-.503-.675-.512-.175-.01-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-.1.05-1.05 1.05-1.127 1.127-.85 3.251-.7 3.842 1.341 5.302 4.444 6.777 6.002 7.37.526.2.937.319 1.258.408 528.188 1.688.358 2.627-.19 2.502-1.026.475-.475.475-.726.375-.776-.1-.05-.375-.075-.675-.225z"></path>
                </svg>
                <span className="z-10 font-bold">
                  {t("landing.participateButton")}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
              </JackpotButton>
            </a>

            <div className="relative flex items-center pt-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-xs uppercase tracking-wider text-muted-foreground/60">
                Ou
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <Link to="/login" className="w-full">
              <JackpotButton
                variant="outline"
                className="w-full font-semibold border-white/20 hover:bg-white/5 transition-colors"
              >
                {t("landing.loginText")}
              </JackpotButton>
            </Link>

            <div className="pt-2 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                {t("landing.forgotPassword")}
              </Link>
            </div>
          </div>
        </JackpotCard>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          &copy; {new Date().getFullYear()} {t("landing.title")}.
        </p>
      </div>
    </div>
  );
}
