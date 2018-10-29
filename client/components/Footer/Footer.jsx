import Link from 'next/link';
import css from './Footer.css';

export default () => (
  <footer className={css.footer}>
    <div className={css.copyright}>
      Copyright &copy; {new Date().getFullYear()} Schooled Lunch
    </div>
    <div className={css.social}>
      <a href="#">Instagram</a> |<a href="#">Facebook</a> |
      <a href="#">Mastadon</a>
    </div>
  </footer>
);
