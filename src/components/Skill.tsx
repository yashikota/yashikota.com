export default function SkillComponent({ name, rate }: { name: string; rate: number }) {
    const star = "⭐".repeat(rate)
    return (
        <tr className="[&>td]:p-0.5 [&>td]:w-40">
            <td>{name}</td>
            <td>{star}</td>
        </tr>
    )
}
