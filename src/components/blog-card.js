import React from 'react'
import {Link} from 'react-router-dom'

const BlogCard = ({heading, date, content, link}) => {
    return(
        <div className = "blog-card">
            <h3 className = "blog-card--header">{heading}</h3>
            <h4 className = "blog-card--subheader">{date}</h4>
            <p className = "blog-card--content">
                {content}
            </p>
            <Link to = '/news'>Read More →</Link>
        </div>
    )
}

export default BlogCard;