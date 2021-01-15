import React from 'react'

const BlogCard = ({heading, date, content, link}) => {
    return(
        <div className = "blog-card">
            <h3 className = "blog-card--header">{heading}</h3>
            <h4 className = "blog-card--subheader">{date}</h4>
            <p className = "blog-card--content">
                {content}
            </p>
            <a href = {link}>Read More →</a>
        </div>
    )
}

export default BlogCard;