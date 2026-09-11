// One heading treatment for every page: a lead word in the page's ink colour
// followed by an accent word set on the blue slab, the same device the homepage
// headline uses behind "Web Developer". Styles live in App.scss so there is a
// single definition rather than a near copy in each page's stylesheet.
const PageHeading = ({ lead, accent }) => {
    return(
        <h2 className="page-heading">{lead} <span className="page-heading-slab">{accent}</span></h2>
    )
}

export default PageHeading
