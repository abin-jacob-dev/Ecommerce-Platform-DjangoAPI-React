
import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer>
            <h2>OLX</h2>

            <p>Buy and sell anything.</p>

            <p>
                © {new Date().getFullYear()} OLX. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
