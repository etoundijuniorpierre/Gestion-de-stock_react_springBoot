import React, { useState } from 'react';
import "./header.css";
import ReactLogo from "../../assets/react.ico";

export default function Header() {
    return(

            <div className="row header-container">
                <div className="col-md-8">
                    <div className="input-group flex-nowrap">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Username" 
                            aria-label="Username" 
                            aria-describedby="addon-wrapping"
                        />
                        <div className="input-group-prepend" >
                            <span className="input-group-text" id="addon-wrapping" style={{height: "100%", cursor: "pointer"}}>
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 ">
                    <div className="row user-section">
                        <div className="col-md-9 text-right">
                            <span>Bonjour</span>
                            {/* {connectedUser?.nom}&nbsp; */}
                        </div>
                        <div className="col-md-3">
                            <a href="javascript:void(0);">
                                {/* [routerLink]="['/profil']" */}
                                <img src={ReactLogo} className="rounded-circle"  />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

    )
}