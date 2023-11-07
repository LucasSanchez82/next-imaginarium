import { readdir } from 'fs/promises';
import { join } from 'path';
import React from 'react';

const page = async () => {
    const readDir = await readdir(join('./', 'upload/dossierEnfant'));
    return (
        <div>
            {readDir.map((el, key) => <li key={key}>{el}</li> )}
        </div>
    );
};

export default page;