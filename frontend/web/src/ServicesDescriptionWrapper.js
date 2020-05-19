import React from 'react';
import {Row,Col} from 'react-bootstrap';

function ServicesDescriptionWrapper({lang,services}) {
    return (
        <>
        {
            services.map((service,index) => {
                var flex_type = (index%2) ? 'flex-row-reverse':'flex-row';
                return (
                    <Row 
                    key={index} 
                    className={`service_description text-white ${flex_type}`} 
                    style=
                    {{ 
                        backgroundColor: `${service.color_scheme}`,
                    }}
                    >
                        <Col xs={12} lg={6} className="d-flex flex-column justify-content-center align-items-center ">
                            <div className="h4">{service.title[lang]}</div>
                            <div className="my-4">
                                {service.description[lang]}
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className="d-flex flex-column justify-content-center align-items-center service_image_wrapper">
                            <img
                                src={require(`./assets/img/${service.image_source}`)}
                            />
                        </Col>
                    </Row>
                );
            })
        }                 
        </>
    );
}

export default ServicesDescriptionWrapper;