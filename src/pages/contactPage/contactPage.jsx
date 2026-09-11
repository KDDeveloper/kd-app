import { LocationOn,Email,PhoneIphone } from "@mui/icons-material"
import PageHeading from "../../components/pageHeading";
import "./contactPage.scss"

const ContactPage = () =>{


    return(
        <>
        <div className="contact-page-container">
            <PageHeading lead="Let's" accent="talk"/>

            <div className="contact-actions">
                <a className="contact-card contact-card-primary" href="mailto:info@kushaldavda.com"
                   aria-label="Email info@kushaldavda.com">
                    <Email/>
                    <h3>info@kushaldavda.com</h3>
                </a>

                <a className="contact-card" href="tel:+917977980995"
                   aria-label="Call +91 79799 80995">
                    <PhoneIphone/>
                    <h3>+91 79799 80995</h3>
                </a>
            </div>

            {/* Deliberately not a card. It was styled identically to the phone
                and email cards but had no link behind it, so it read as a
                broken one. */}
            <p className="contact-location">
                <LocationOn/>
                Mumbai, Maharashtra
            </p>

        </div>
        </>
    )
}

export default ContactPage
