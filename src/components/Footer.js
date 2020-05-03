import React from 'react'
import logo from '../logo_footer.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer container flex dark">
      <div className="footer__logo">
        <span className="font-size-small">Powered by</span>
        <img src={logo} className="logo" alt="logo" />
      </div>
      <nav className="footer__nav">
        <ul>
          <li>
            <a
              className="no-link link-light"
              href="https://demo.brandibble.co/order/terms/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Use
            </a>
          </li>
          <li>
            <a
              className="no-link link-light"
              href="https://demo.brandibble.co/order/privacy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Pricvacy Policy
            </a>
          </li>
          <li>
            <Link to="/refunds" className="no-link link-light">
              Refunds
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

Footer.displayName = 'Footer'

export default Footer
