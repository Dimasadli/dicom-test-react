import React from "react";
import "./CommonLayout.css";

function CommonLayout({ children }) {
  return (
    <>
      {children}
      <footer id="footer">
        <div className="container footer-bottom clearfix">
          <div className="copyright">
            &copy; Copyright{" "}
            <strong>
              <span>Medic-Innovate.AI</span>
            </strong>
            . All Rights Reserved
          </div>
          {/* <div class="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div> */}
        </div>
      </footer>
    </>
  );
}

export default CommonLayout;
