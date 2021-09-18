import React from 'react';
import DocumentationCard from './DocumentationCard';
import testImg from './images/bg_demo.png';
import demoToolBg from './images/bg_demo_tool.png';

const documentationData = [
    {title: 'Data Generator', content: 'Mit diesem Tool können Sie Demo-Daten in Ihre persönliche Datenspace einfügen. Die Eingabe ist einfach und übersichtlich gestaltet.', href: 'https://datagenerator.ds2g.io', bgImg: demoToolBg},
    {title: 'Card Title', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', bgImg: testImg},
    {title: 'Card Title', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', bgImg: testImg},
    {title: 'Card Title', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', bgImg: testImg},
    {title: 'Card Title', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', bgImg: testImg},
    {title: 'Card Title', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', bgImg: testImg},
    {title: 'News-Blog', content: 'Im News-Blog werden alle Neuigkeiten zur Platform beschrieben.', href: '/documentation/news-blog', bgImg: testImg},
];


const renderDocumentation = () => {
    return documentationData.map(data => { // TODO key={survey._id}
        return (
            <DocumentationCard title={data.title} content={data.content} bgImg={data.bgImg} href={data.href}/>
        );
    });
}

const Documentation = () => {
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h4>
                Dokumentation
            </h4>
            <div class="row">
                { renderDocumentation() }
            </div>
        </div>
    );
};

export default Documentation;