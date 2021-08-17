import React from 'react';
import PricingCard from './PricingCard';
import testImg from './images/bg_demo.png';

const documentationData = [
    {title: 'Private Nutzung', content: 'Mit diesem Tool können Sie Demo-Daten in Ihre persönliche Datenspace einfügen. Die Eingabe ist einfach und übersichtlich gestaltet.', href: 'https://datagenerator.ds2g.io', hrefText: 'Spenden', bgImg: demoToolBg,},
    {title: 'Kommerzielle Nutzung', content: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.', href: 'https://datagenerator.ds2g.io', hrefText: 'Anfrage erstellen', bgImg: testImg},
];


const renderPricing = () => {
    return documentationData.map(data => { // TODO key={survey._id}
        return (
            <PricingCard title={data.title} content={data.content} bgImg={data.bgImg} href={data.href} hrefText={data.hrefText}/>
        );
    });
}

const Pricing = () => {
    return (
        <div class="container" style={{ textAlign: 'center' }}>
            <h1>
            Pricing!
            </h1>
            <div class="row">
                { renderPricing() }
            </div>
        </div>
    );
};

export default Pricing;