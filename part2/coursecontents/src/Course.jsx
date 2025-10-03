const Course = ({ course }) => {
    return (
        <div>
            {
                course.map(c => {
                    const total = c.parts.reduce((sum, part) => sum + part.exercises, 0)

                    return (
                        <div key={c.id}>
                            <h2>{c.name}</h2>
                            {c.parts.map(part => (
                                <p key={part.id}>
                                    {part.name} {part.exercises}
                                </p>
                            ))}
                            <p><strong>Total Exercises: {total}</strong></p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Course
