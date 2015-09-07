//
//  Person.m
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-16.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import "Person.h"

@implementation Person

-(instancetype) initWithName:(NSString *)name age:(NSInteger)age height:(float)height {

    self = [super init];

    if (self) {

        self._name = name;
        _age = age;
        self._height = height;

    }

    return self;
}

- (NSString *) description {

    // 注意：_name这里的参数，一定不能换成self，会造成循环调用
    return [NSString stringWithFormat:@"姓名：%@", self._name];
}


- (void)setAge: (NSInteger)age {

     _age = age;
}

- (NSInteger) getAge {
    return _age;
}

- (void) whoami {
    NSLog(@"I am a human");
}

@end
