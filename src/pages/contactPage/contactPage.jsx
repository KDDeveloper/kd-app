import { LocationOn,Email,PhoneIphone } from "@mui/icons-material"
import "./contactPage.scss"

const ContactPage = () =>{


    return(
        <>
        <div className="contact-page-container">
            <div className="contact-box">
                <LocationOn/>
                <h3>
                    Mumbai,Maharashtra.
                </h3>
            </div>
            <div className="contact-box">
                <a href="tel:7977980995">
                    <PhoneIphone/>
                    <h3>
                        7977980995
                    </h3>
                </a>
            </div>
            <div className="contact-box">
               <a href="mailto:kddfreelance@gmail.com">
                    <Email/>
                    <h3>
                        kddfreelance@gmail.com
                    </h3>
                </a>
            </div>

        </div>
        </>
    )
}

export default ContactPage
