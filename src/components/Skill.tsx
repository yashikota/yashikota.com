import { css } from "../../styled-system/css"

export default function SkillComponent({ name, rate }: { name: string; rate: number }) {
    const star = "⭐".repeat(rate)
    return (
        <tr
            className={css({
                "& > td": {
                    padding: "0 1em",
                    width: "150px",
                },
            })}
        >
            <td>{name}</td>
            <td>{star}</td>
        </tr>
    )
}
