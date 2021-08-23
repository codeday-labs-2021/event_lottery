import React, { useState } from "react";

const NewUrl = ({urlres}) => {

    return (
        <>
         {urlres!="" ?(
<div class="card text-center">
  <div class="card-header">
    New Url
  </div>
  <div class="card-body">
     
    <p class="card-text">${urlres}</p>
     
  </div>
   
</div>):""}
    </>
    );
}

export default NewUrl;