const Footer = () => {
  return (
    <footer className="text-secondary border-t border-white/8 py-5">
      <div className="container flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="text-xs leading-5">
          University Artificial Intelligence Course Project · Camera Alarm
        </p>
        <p className="text-xs">
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/theprimeshak/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary font-semibold text-white transition"
          >
            ThePrimeShak
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
