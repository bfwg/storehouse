//
//  Person.h
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-16.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Person : NSObject {

    NSString *_name;
    NSInteger _age;
    float _height;

}

- (instancetype)initWithName:(NSString *)name age:(NSInteger)age height:(float)_height;

@end
