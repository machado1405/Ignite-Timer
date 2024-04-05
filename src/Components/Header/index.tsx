import { HeaderContainer } from "./styles";
import logo from '../../assets/logo.svg';
import { Scroll, Timer } from "phosphor-react";
import { NavLink } from "react-router-dom";

export function Header() {
    return (
        <HeaderContainer>
            <img src={logo} alt="Logo Ignite" />
            <nav>
                <NavLink to="/" title="Cronômetro">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    );
}