import { useRef } from "react";

export function saveToken(token, id){
    localStorage.setItem("ACCESS_TOKEN",token);
    localStorage.setItem("ID",id);
    //this.token = token;
};

export function getusu(){
    
    const usu = localStorage.getItem("ID") || "";
    
    return usu;
};

export function getToken(){
    return localStorage.getItem("ACCESS_TOKEN");
};
/*
export function getAuthHeaders(){
    const headers = useRef ({
        Authorization: `${getToken()}`,
      });
      return headers;
};*/

