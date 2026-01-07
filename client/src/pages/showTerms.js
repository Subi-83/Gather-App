import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function showTerms(onAgree, onCancel) {
  MySwal.fire({
    title: "Terms & Conditions",

    html: `
      <div style="
        max-height:50vh;
        overflow-y:auto;
        text-align:left;
        font-size:14px;
        line-height:1.6;
        color:#111827;
      ">
        <p>1. Users must be of legal age to use this app.</p>
        <p>2. Users must keep login credentials confidential.</p>
        <p>3. No spam or fraudulent content.</p>
        <p>4. Hate speech is prohibited.</p>
        <p>5. No malware allowed.</p>
        <p>6. Permissions only with consent.</p>
        <p>7. Company may remove violating content.</p>
        <p>8. Company not responsible for user messages.</p>
        <p>9. Third-party links at user risk.</p>
        <p>10. Report security issues.</p>
        <p>11. Access may be restricted.</p>
        <p>12. Violations may terminate account.</p>
        <p>13. Continued use means acceptance.</p>
      </div>
    `,

    showCancelButton: true,
    confirmButtonText: "I Agree",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    width: "420px",
    padding: "1rem",
    allowOutsideClick: false,

    customClass: {
      popup: "z-[9999]"
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onAgree();
    } else if (result.isDismissed) {
      onCancel();
    }
  });
}
