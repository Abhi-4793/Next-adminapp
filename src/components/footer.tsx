"use client";

import React from "react";
import styles from "../styles/footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.leftText}>
          Copyright © AKS Machine Test. All Rights Reserved.
        </div>

        <a
          href="https://www.akswebsoft.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.rightImage}
        >
          <Image
            className={styles.logo}
            src="/images/akslogo.png"
            alt="AKS Websoft Consulting Pvt. Ltd."
            title="AKS Websoft Consulting Pvt. Ltd."
            width={150}
            height={35}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
