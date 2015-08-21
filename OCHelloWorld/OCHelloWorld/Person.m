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
        
        _name = name;
        _age = age;
        _height = height;
        
    }
    
    return self;
}

- (NSString *)description {
    
    // 注意：_name这里的参数，一定不能换成self，会造成循环调用
    return [NSString stringWithFormat:@"姓名：%@", _name];
}

- (getName {
    
}
    
@end
