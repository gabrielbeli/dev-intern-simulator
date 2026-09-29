function InternCard({ name, level, xp }) {
    return (
        <div>
            <h2>{name}</h2>
            <p>Level: {level}</p>
            <p>XP: {xp}</p>
        </div>
    )
}

export default InternCard