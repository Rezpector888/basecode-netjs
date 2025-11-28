import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SchedulesModule } from '@modules/rostering';
import { AppConfig } from '@environment';

export const SwaggerSetup = (app: INestApplication, configApp: AppConfig): void => {
  const appName = configApp.name;
  const options = new DocumentBuilder()
    .setTitle(`API DOCUMENTATION ${appName}`)
    .setDescription(
      `This API documentation is generated using Swagger OpenAPI.</br>
      For more details about Swagger, visit <a href="http://swagger.io" target="_blank">Swagger.io</a>.</br>
      To download the API specification in JSON format, click <a href="${configApp.appUrl}/swagger.json">here</a>.</br>
      To download the API specification in YAML format, click <a href="${configApp.appUrl}/swagger.yaml">here</a>.</br>
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Default',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'azure',
    )
    .addGlobalResponse(
      {
        status: 500,
        description: 'Internal Server Error',
      },
      {
        status: 200,
        description: 'Ok',
      },
    )
    .build();
  const document = () => SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showCommonExtensions: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    urls: [
      { url: 'docs/swagger.json', name: 'Main API' },
      { url: 'docs/schedules/swagger.json', name: 'Schedules Module' },
    ],
    jsonDocumentUrl: 'docs/swagger.json',
    customSiteTitle: `${appName} API Documentation`,
  });

  //   const optionsSchedule = new DocumentBuilder()
  //     .setTitle(`API DOCUMENTATION ${appName} SCHEDULE`)
  //     .setDescription(
  //       `This API documentation is generated using Swagger OpenAPI.</br>
  //       For more details about Swagger, visit <a href="http://swagger.io" target="_blank">Swagger.io</a>.</br>
  //       To download the API specification in JSON format, click <a href="${configApp.appUrl}/swagger.json">here</a>.</br>
  //       To download the API specification in YAML format, click <a href="${configApp.appUrl}/swagger.yaml">here</a>.</br>
  //       `,
  //     )
  //     .setVersion('1.0')
  //     .addBearerAuth(
  //       {
  //         description: 'Default',
  //         type: 'http',
  //         in: 'header',
  //         scheme: 'bearer',
  //         bearerFormat: 'JWT',
  //       },
  //       'azure',
  //     )
  //     .addGlobalResponse({
  //       status: 500,
  //       description: 'Internal Server Error',
  //     })
  //     .build();
  //   const documentSchedule = SwaggerModule.createDocument(app, optionsSchedule, {
  //     include: [SchedulesModule],
  //   });
  //   SwaggerModule.setup('docs/schedules', app, documentSchedule, {
  //     explorer: true,
  //     swaggerOptions: {
  //       docExpansion: 'none',
  //       filter: true,
  //       showCommonExtensions: true,
  //       showRequestDuration: true,
  //       tagsSorter: 'alpha',
  //       operationsSorter: 'alpha',
  //     },
  //     jsonDocumentUrl: '/docs/schedules/swagger.json',
  //   });
};
