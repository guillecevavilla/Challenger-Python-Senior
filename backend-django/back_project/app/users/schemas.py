from drf_yasg import openapi
from drf_yasg.openapi import Schema, Response


RespLogin = Response('Data returned from login',
                     schema=Schema(title='ReturnedDataLogin',
                                   description='Structure of data returned from login',
                                   type='object',
                                   properties={'id': Schema(type='integer'),
                                               'name': Schema(type='string'),
                                               'document': Schema(type='string'),
                                               'email': Schema(type='string'),
                                               'created_at': Schema(type='string'),
                                               'access': Schema(description='Access token', type='string'),
                                               'refresh': Schema(description='Refresh token', type='string'),
                                               },
                                   ),
                     )


RespRefreshToken = Response('Data returned from refresh token',
                            schema=Schema(title='ReturnedDataRefreshToken',
                                          description='Structure of data returned from refresh token',
                                          type='object',
                                          properties={'access': Schema(description='Access token', type='string'),
                                                      'refresh': Schema(description='Refresh token', type='string'),
                                                      },
                                          ),
                            )
