//
//  Person.h
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-16.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface Person : NSObject {
    
    NSInteger _age;
    
}

@property CGPoint position;

@property NSString *_name;

@property float _height;

- (instancetype)initWithName:(NSString *)name age:(NSInteger)age height:(float)_height;

- (void)setName:(NSString *)name;

- (NSString *) getName;

- (void)setAge:(NSInteger)age;

- (NSInteger)getAge;

- (void) whoami;

@end
