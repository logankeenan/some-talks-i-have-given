export const renderHtmlWrapper = (content) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<nav>
<a href="/recipes">Recipes</a>
<a href="/recipes/create">Create</a>
</nav>
${content}
</ul>
</body>
</html>
    `
}