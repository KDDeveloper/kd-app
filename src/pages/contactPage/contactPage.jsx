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
                <PhoneIphone/>
                <h3>
                    7977980995
                </h3>
            </div>
            <div className="contact-box">
                <Email/>
                <h3>
                    kddfreelance@gmail.com
                </h3>
            </div>

        </div>
        </>
    )
}

export default ContactPage