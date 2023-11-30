import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function NavBar2() {
    const navigate = useNavigate();
const back=function goBack() {
    //window.history.back();
    
    navigate('/Home');
}

    return (
        <>
            <div class="barra">
                <nav class="navbar navbar-expand-lg navbar-dark">
                    <div class="container-fluid">
                        <a href="" class="navbar-brand text-info fw-semibold fs-4">TIENDA DON PIPOCA</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <section class="offcanvas offcanvas-start" id="menuLateral" tabindex="-1">
                            <div class="offcanvas-header" data-bs-theme="dark">
                                <h5 class="offcanvas-title text-info">TIENDA DON PIPOCA</h5>
                                <button class="btn-close" type="button" aria-label="Close" data-bs-dismiss="offcanvas"></button>
                            </div>
                            <div class="offcanvas-body d-flex flex-column justify-content-between px-0">
                                <ul class="navbar-nav fs-5 justify-content-evenly">
                                    <div class="offcanvas-body d-flex flex-column justify-content-between px-0">
                                        <ul class="navbar-nav fs-5">
                                            <li class="nav-item p-3 py-md-1">
                                                <a  href='#' onClick={back} class="nav-link">Volver Atras</a>
                                            </li>
                                        </ul>
                                    </div>
                                </ul>
                            </div>
                        </section>
                    </div>
                </nav>
            </div>
        </>
    )
}
