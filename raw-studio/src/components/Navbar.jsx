"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TransitionLink } from "./TransitionLink";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.isLoggedIn) {
          setSession(data);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Hide navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 uppercase right-0 z-50 text-white mix-blend-difference">
      
      <div className=" mx-auto px-6  py-6 flex items-center justify-between">
        {/* Logo */}
        <TransitionLink href="/" className="text-2xl tracking-tight">
          {pathname?.startsWith("/raw-sport") ? (
<svg  width="51"
              height="23" viewBox="0 0 25 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M8.37708 5.50466C8.34691 7.46946 8.37487 9.51735 8.37807 11.4864L8.38103 13.126C8.38117 13.3862 8.39425 13.8197 8.3593 14.0656C9.78049 14.2948 11.2123 13.6574 12.5607 13.4193C12.7916 13.3785 14.8537 13.9959 14.9444 14.168C14.7985 14.4914 12.6013 15.2435 12.1883 15.2508C12.1078 15.2581 11.9969 15.2564 11.9413 15.3045C11.9942 15.3547 12.0047 15.3541 12.0766 15.3761C12.3774 15.4572 12.7198 15.4968 13.0438 15.4815C13.3176 15.4684 13.8528 15.2165 14.1176 15.3224C14.2546 15.4122 14.3997 15.71 14.4623 15.8444C15.021 17.0432 15.5428 18.2553 16.117 19.4467C16.2219 19.6643 16.2914 19.9319 16.3926 20.1616C16.777 21.0162 17.1749 21.8646 17.5869 22.706C18.2985 24.1797 19.1038 26.0562 20.5515 26.9438C21.0479 27.2478 21.6971 27.1597 22.2388 27.418C21.2828 28.0037 20.1266 28.0738 19.0351 27.946C18.1996 27.8482 17.2739 27.5896 16.6228 27.0273C15.3443 25.9227 13.7704 21.5233 13.1001 19.8514C12.9026 19.359 12.6773 18.8838 12.4649 18.3987C12.1777 17.7429 11.8404 16.8521 11.399 16.2958C10.6429 15.3433 9.45323 15.5738 8.3919 15.4536C8.35409 15.8623 8.37638 16.7111 8.3761 17.1618L8.38103 20.629C7.4561 20.5928 6.50692 20.3806 5.67923 19.9598C5.53551 19.8866 5.37433 19.7727 5.34731 19.6008C5.29961 19.2956 5.31057 18.9746 5.30977 18.6652L5.30582 16.8287C5.306 16.5294 5.36393 15.831 5.20407 15.6207C4.93166 15.2635 4.37332 14.844 4.02752 14.5528C4.20774 14.4099 4.42116 14.1659 4.59851 13.998C4.84046 13.7689 5.08589 13.584 5.32755 13.3656C5.26246 12.5048 5.29861 11.0006 5.30582 10.1112C5.31668 8.76855 5.26539 7.26048 5.31668 5.94116C5.68148 5.90545 6.14395 5.81093 6.51792 5.75721C7.13825 5.6681 7.75813 5.59406 8.37708 5.50466Z" fill="white"/>
<path d="M5.31668 22.2606C6.11072 22.492 7.53261 22.5094 8.35733 22.7269C8.42794 24.0699 8.59648 25.2077 9.85592 25.9634C10.0569 26.0839 10.9595 26.4938 10.9781 26.6733C10.9172 26.7484 10.814 26.793 10.7183 26.7896C9.7946 26.7555 8.89912 27.016 8.10345 26.4556C7.94554 26.6507 7.80112 26.8114 7.63224 26.9955C7.48762 27.1307 6.96308 27.7826 6.82713 27.769C6.60146 27.606 5.7693 26.7138 5.59625 26.4715C4.85144 26.8268 4.35959 26.866 3.53952 26.8105C3.31623 26.7957 2.86376 26.8557 2.77293 26.6156C2.80105 26.3761 3.71839 26.0515 3.99492 25.7605C4.2994 25.44 4.39989 25.3264 4.65778 24.9701C5.38049 23.9717 5.26673 23.4085 5.31668 22.2606Z" fill="white"/>
<path d="M0.153119 15.1325C0.430359 15.1729 0.636542 15.2017 0.892041 15.3383C1.78017 15.8294 2.21941 16.9203 2.73737 17.7505C3.10674 18.3424 3.37243 18.6784 3.87144 19.1494C4.40118 19.6617 4.97223 20.1811 5.67034 20.4709C7.32244 21.1565 9.25824 21.344 11.0176 21.6133C11.3574 21.6653 11.7182 21.6696 12.0618 21.7207C12.4348 21.7762 12.9209 21.6909 13.2571 21.8808C13.3741 21.9495 13.686 22.6253 13.6987 22.7508L13.6602 22.7866C13.4942 22.8033 12.9317 22.7822 12.7346 22.7677C11.8639 22.7038 10.7817 22.6658 9.92902 22.5161C9.16758 22.4619 8.24614 22.2674 7.48702 22.1333C7.03281 22.0531 6.56353 21.9848 6.10994 21.8917C4.86417 21.636 3.49819 20.9545 2.20985 21.1947C0.875917 21.4434 1.33927 22.7266 1.11826 23.064C1.08413 23.0851 1.05815 23.1113 1.02046 23.1008C0.542821 22.9656 0.440818 21.9886 0.472199 21.6193C0.516565 21.0972 0.78456 20.5933 1.15382 20.278C1.53074 19.9525 2.02099 19.7921 2.51609 19.8315L2.48547 19.8037C1.43494 18.8588 1.26119 17.3823 0.573949 16.2133C0.462837 16.0243 0.0100944 15.4457 0 15.2657C0.0464427 15.1713 0.0456631 15.194 0.153119 15.1325Z" fill="white"/>
<path d="M9.0192 11.1503C12.4437 12.1321 15.9805 12.402 19.3177 13.7504C21.2522 14.5321 23.305 15.7891 23.7868 18.0179C23.9025 18.5532 23.9906 19.1201 23.768 19.6426C23.2533 20.8502 21.9054 21.5649 20.759 22.0607C20.0382 22.4085 19.5246 22.4529 18.7635 22.5668C17.8818 22.6988 18.076 22.5309 17.7104 21.7386C18.2029 21.6158 18.5448 21.4675 18.9482 21.1539C19.6699 20.5835 20.1387 19.7488 20.2522 18.8323C20.8024 14.4745 13.067 12.778 9.99916 12.2321C9.67391 12.1742 9.32821 12.1267 8.99944 12.0859C8.9787 11.7341 8.96739 11.4883 8.96881 11.1364C8.98894 11.1401 9.00096 11.145 9.0192 11.1503Z" fill="white"/>
<path d="M12.2386 15.3025C12.1936 15.3629 12.1664 15.3524 12.0786 15.3761C12.0067 15.3541 11.9962 15.3547 11.9433 15.3045C11.9989 15.2565 12.1098 15.2591 12.1902 15.2518L12.2386 15.3025Z" fill="white"/>
<path d="M12.614 0.0071738C13.4662 -0.0244986 14.5543 0.0492278 15.386 0.217965C19.8238 1.11849 22.2304 6.14107 19.9124 10.1431C19.3102 11.1826 18.5783 11.866 17.5701 12.5274C16.874 12.3665 15.9265 12.0768 15.2793 11.9597C15.4878 11.6375 15.8166 11.432 16.0291 11.1573C16.5484 10.4854 17.1058 9.6945 17.504 8.94792C18.4256 6.94264 18.1082 5.07279 16.6593 3.4216C15.5324 2.13526 13.945 1.35074 12.2446 1.24011C10.6398 1.14393 9.03925 1.68957 7.91378 2.85982C7.70417 3.07778 7.50549 3.31717 7.28056 3.51805C6.98968 3.5573 6.70316 3.60338 6.41124 3.63935L6.40136 3.59958C6.55877 3.08084 6.94614 2.46137 7.3092 2.07233C8.73999 0.53952 10.6396 0.118562 12.614 0.0071738Z" fill="white"/>
<path d="M12.289 7.63743C12.3999 7.70479 12.8341 8.69298 12.9539 8.88727C12.8689 9.23314 12.7014 9.55209 12.5913 9.8935C13.9824 8.57772 14.614 10.1663 14.3961 10.3568C14.2748 10.3313 13.9174 10.118 13.678 10.0516C12.9011 10.2601 12.9492 10.7861 12.9509 11.4705C12.7647 11.4377 12.641 11.4093 12.4589 11.3581C12.2108 11.3222 12.0394 11.2454 11.7309 11.2119C11.659 10.8805 11.6248 10.4567 11.4078 10.1908C11.0129 9.70753 10.5005 10.1445 10.1503 10.4294C10.4161 8.50092 11.8077 9.81943 11.9709 9.80699C11.9464 9.63502 11.7084 9.09871 11.6301 8.934C11.8796 8.49427 12.0939 8.10624 12.289 7.63743Z" fill="white"/>
<path d="M24.7924 5.68264C24.9015 5.69674 24.9491 5.73713 24.9969 5.83477C25.0065 5.9078 24.9939 5.98538 24.9594 6.04953C24.6407 6.64181 24.1712 7.03517 23.5685 7.26954C24.3602 8.18705 24.6092 9.25788 24.3518 10.4652C24.2533 10.9271 23.9854 11.1728 23.5951 11.3969C23.5678 10.9442 23.4587 10.4305 23.3778 9.98199C23.0903 8.90822 22.7831 8.1367 22.1123 7.23275C21.9743 6.99839 21.6324 6.74404 21.5255 6.49995C21.4372 6.29799 21.4116 5.94546 21.3448 5.7065C22.063 6.1363 23.1279 6.35795 23.9419 6.1261C24.2485 6.03867 24.5253 5.85207 24.7924 5.68264Z" fill="white"/>
<path d="M5.45893 1.52746C5.60102 1.61494 5.88131 2.49293 6.02794 2.654C6.05035 2.67879 6.11996 2.78521 6.14649 2.82005C5.89942 3.27274 5.76482 3.88079 5.64663 4.3811C5.96216 4.26181 6.96285 4.12697 7.31908 4.0838C9.68343 3.79736 12.3459 3.7621 14.7034 4.09574C15.281 4.17749 16.4501 4.38405 16.7393 4.87825C16.807 4.99394 17.0281 5.34147 17.008 5.46588L16.9587 5.48577C15.375 4.94383 13.3866 4.65044 11.722 4.74402C9.26886 4.88196 4.27054 4.92274 2.50423 6.78035C2.25751 7.03664 2.06942 7.34476 1.95399 7.68218C1.80333 8.13574 1.82377 8.78373 2.16836 9.1259C2.85068 9.80303 3.82819 10.0392 4.6884 10.3121C4.71804 10.6417 4.68185 10.9983 4.70322 11.3501C3.25519 10.868 1.33864 11.0091 0.606548 9.39535C-0.427353 7.11613 1.58698 5.643 3.4921 4.96376C3.79015 4.85752 4.14928 4.78338 4.43353 4.65453C4.05475 4.67113 3.67723 4.6699 3.29946 4.68834C2.98211 3.8422 2.6355 3.55211 1.96782 3.05669C2.22335 3.0369 3.03208 3.09077 3.29156 3.14121C4.20904 3.31961 4.79057 3.579 5.32261 4.35823C5.18719 3.77354 5.11548 3.40156 4.84053 2.86181C5.13504 2.33684 5.23706 2.09158 5.45893 1.52746Z" fill="white"/>
</svg>

          ) : (
            <svg
              width="51"
              height="23"
              viewBox="0 0 51 23"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M51 0H45.6115L45.0236 1.83296L41.8437 12.8374L36.9706 1.57665C36.5745 0.618554 35.6296 0 34.5507 0C33.4718 0 32.5387 0.618554 32.1474 1.56625L27.2841 12.8062L24.7146 4.10667C24.0005 1.68826 21.6843 0 19.0815 0H10.3986C8.46087 0.0264824 6.72468 0.450201 5.21835 1.26359V0H0V23H5.21835V11.2371C5.24379 8.44411 6.14954 6.60926 7.98941 5.62563C8.59586 5.29838 9.27273 5.10733 10.0054 5.05625C8.7504 6.94691 8.11559 9.10901 8.11559 11.5019C8.11559 15.0184 9.40086 17.9466 11.9303 20.1995C13.9834 22.058 16.3887 23 19.0893 23C20.9996 22.9801 22.773 22.4987 24.3761 21.5671C24.8016 22.4382 25.7025 23 26.7246 23H26.7579C27.826 23 28.7738 22.3805 29.167 21.4309L34.5566 9.01916L39.9412 21.4205C40.3373 22.3805 41.2832 23.0009 42.3523 23.0009H42.3914C43.5349 23.0009 44.5306 22.2916 44.87 21.2342L50.0923 3.20816L51 0ZM22.8268 16.3955C22.7192 16.4986 22.6067 16.6007 22.4883 16.6991C21.4759 17.5456 20.3609 17.956 19.0815 17.956C17.1946 17.956 15.7128 17.137 14.5547 15.4525C13.7438 14.2665 13.333 12.9376 13.333 11.5019C13.333 9.39843 14.1047 7.69409 15.6922 6.29242C16.3828 5.68048 17.1927 5.28703 18.1004 5.12246C18.1933 5.10544 18.2853 5.09787 18.3772 5.09787C19.0551 5.09787 19.684 5.54618 19.8757 6.20729L22.8268 16.3955Z"
                fill="currentColor"
              />
              <path d="M51 18.864H46.7568V23H51V18.864Z" fill="currentColor" />
            </svg>
          )}
        </TransitionLink>        {/* Menu */}
        <div className="flex items-center gap-8">
          <TransitionLink
            href="/projects"
            className="text-xs medium transition group relative overflow-hidden"
          >
            <span className="relative block h-full overflow-hidden">
              <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Projects
              </span>
              <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                Projects
              </span>
            </span>
          </TransitionLink>
          <Link
            href="#about"
            className="text-xs medium transition group relative overflow-hidden"
          >
            <span className="relative block h-full overflow-hidden">
              <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                About
              </span>
              <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                About
              </span>
            </span>
          </Link>
          <Link
            href="#about"
            className="text-xs medium transition group relative overflow-hidden"
          >
            <span className="relative block h-full overflow-hidden">
              <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Contact
              </span>
              <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                Contact
              </span>
            </span>
          </Link>

          {!loading && session ? (
            <>
              {session.role === "ADMIN" && (
                <>
                  <TransitionLink
                  href="/raw-sport"
                  className="text-xs medium transition group relative overflow-hidden"
                >
                  <span className="relative block h-full overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                      Raw Sport
                    </span>
                    <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                      Raw Sport
                    </span>
                  </span>
                </TransitionLink>
              
                <TransitionLink
                  href="/admin"
                  className="text-xs medium transition group relative overflow-hidden"
                >
                  
                  <span className="relative block h-full overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                      Dashboard
                    </span>
                    <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                      Dashboard
                    </span>
                  </span>
                </TransitionLink>
                  </>
              )}

              {session.role === "RAW-SPORT" && (
                <TransitionLink
                  href="/raw-sport"
                  className="text-xs medium transition group relative overflow-hidden"
                >
                  <span className="relative block h-full overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                      Raw Sport
                    </span>
                    <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                      Raw Sport
                    </span>
                  </span>
                </TransitionLink>
              )}

              <button
                onClick={handleLogout}
                className="text-xs medium transition group relative overflow-hidden"
              >
                <span className="relative uppercase block h-full overflow-hidden">
                  <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                    Logout
                  </span>
                  <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                    Logout
                  </span>
                </span>
              </button>
            </>
          ) : (
            !loading && (
              <TransitionLink
                href="/login"
                className="text-xs medium transition group relative overflow-hidden"
              >
                <span className="relative block h-full overflow-hidden">
                  <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                    RAW+sport
                  </span>
                  <span className="absolute block text-center transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
                    Login
                  </span>
                </span>
              </TransitionLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
}